import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock3, LoaderCircle, Volume2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { AICopilot } from '../components/lms/AICopilot';
import { getLevel, getSubLevels, saveLearnerProgress } from '../services/lmsApi';
import './LmsPages.css';

export function SubLevelLearning() {
  const { levelId, subLevelId } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState(null); const [subLevel, setSubLevel] = useState(null);
  const [doneTasks, setDoneTasks] = useState([]); const [speakingMinutes, setSpeakingMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [error, setError] = useState('');
  useEffect(() => { Promise.all([getLevel(levelId), getSubLevels(levelId)]).then(([levelData, subs]) => { setLevel(levelData); setSubLevel((subs || levelData.subLevels || []).find((item) => String(item.id) === String(subLevelId))); }).catch((err) => setError(err.message)); }, [levelId, subLevelId]);
  useEffect(() => { if (!subLevel || saved) return undefined; setSeconds((subLevel.durationMinutes || 0) * 60); return undefined; }, [subLevel, saved]);
  useEffect(() => { if (seconds <= 0 || saved) return undefined; const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000); return () => clearInterval(timer); }, [seconds, saved]);
  const tasks = useMemo(() => [...(subLevel?.tasks || [])].sort((a, b) => a.orderIndex - b.orderIndex), [subLevel]);
  const complete = async () => { setSaving(true); setError(''); try { await saveLearnerProgress({ levelId: Number(levelId), subLevelId: Number(subLevelId), completed: true, speakingSeconds: Number(speakingMinutes) * 60 }); setSaved(true); } catch (err) { setError(err.message || 'Could not save progress.'); } finally { setSaving(false); } };
  if (error && !level) return <div className="lms-state lms-state--error">{error}</div>;
  if (!level || !subLevel) return <div className="lms-state"><LoaderCircle className="lms-spin" size={28} /> Loading lesson...</div>;
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0'); const secs = (seconds % 60).toString().padStart(2, '0');
  return <main className="lms-page container"><button className="lms-back" onClick={() => navigate(`/learning/levels/${levelId}`)}><ArrowLeft size={17} /> Back to level</button><div className="lms-detail-layout"><div>
    <section className="lms-lesson-header"><p className="lms-eyebrow">Level {level.levelNumber} · Sub-level {subLevel.subNumber}</p><h1>{subLevel.topic}</h1><div className="lms-timer"><Clock3 size={18} /> {mins}:{secs}</div></section>
    <div className="lms-task-list">{tasks.map((task, index) => <Card key={task.id}><CardBody><div className={`lms-task ${doneTasks.includes(task.id) ? 'is-done' : ''}`}><button className="lms-task-check" onClick={() => setDoneTasks((items) => items.includes(task.id) ? items.filter((id) => id !== task.id) : [...items, task.id])} aria-label="Mark task complete"><CheckCircle2 size={22} /></button><div><span className="lms-task-type">{task.taskType} · Task {index + 1}</span><p>{task.content}</p>{task.pronunciation && <span className="lms-pronunciation"><Volume2 size={14} /> {task.pronunciation}</span>}</div></div></CardBody></Card>)}</div>
    <div className="lms-complete-bar"><label htmlFor="speaking-minutes">Speaking minutes<input id="speaking-minutes" type="number" min="0" step="1" value={speakingMinutes} onChange={(event) => setSpeakingMinutes(event.target.value)} /></label><Button onClick={complete} disabled={saving || saved}>{saving ? <LoaderCircle className="lms-spin" size={16} /> : <CheckCircle2 size={16} />} {saved ? 'Saved' : 'Complete sub-level'}</Button></div>{error && <p className="lms-inline-error">{error}</p>}
  </div><AICopilot topic={subLevel.topic} task={tasks[0]?.content || ''} language={level.language} stage={level.stage} levelId={level.id} levelNumber={level.levelNumber} /></div></main>;
}
