import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock3, MessageCircle, Play, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AICopilot } from '../components/lms/AICopilot';
import { getLevel, getSubLevels } from '../services/lmsApi';
import './LmsPages.css';

export function LevelDetail() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [subLevels, setSubLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { const [levelData, subLevelData] = await Promise.all([getLevel(levelId), getSubLevels(levelId)]); setLevel(levelData); setSubLevels(subLevelData || levelData.subLevels || []); }
    catch (err) { setError(err.message || 'Could not load this level.'); }
    finally { setLoading(false); }
  }, [levelId]);
  useEffect(() => { load(); }, [load]);
  if (loading) return <div className="lms-state"><RefreshCw className="lms-spin" size={28} /> Loading level...</div>;
  if (error) return <div className="lms-page container"><div className="lms-state lms-state--error"><strong>Could not load level</strong><span>{error}</span><Button onClick={load}>Retry</Button></div></div>;
  return <main className="lms-page container">
    <button className="lms-back" onClick={() => navigate('/learning')}><ArrowLeft size={17} /> Back to roadmap</button>
    <div className="lms-detail-layout"><div>
      <section className="lms-hero"><p className="lms-eyebrow">Stage {level.stage} · {level.language}</p><h1>Level {level.levelNumber}: {level.title}</h1><p className="lms-muted">{level.groupLabel || 'Speaking practice'} · {level.cefrTarget || 'CEFR target N/A'} · {level.durationMinutes || 'N/A'} minutes</p><Button onClick={() => subLevels[0] && navigate(`/learning/levels/${level.id}/sublevels/${subLevels[0].id}`)}><Play size={16} /> Start learning</Button></section>
      <div className="lms-sublevel-list">{subLevels.length === 0 ? <div className="lms-state"><span>No sub-levels available.</span></div> : subLevels.map((subLevel) => <Card key={subLevel.id}><CardBody><div className="lms-sublevel-row"><div><span className="lms-level-number">Sub-level {subLevel.subNumber}</span><h2>{subLevel.topic}</h2><p className="lms-muted"><Clock3 size={14} /> {subLevel.durationMinutes || 'N/A'} minutes <span>·</span> <MessageCircle size={14} /> {subLevel.tasks?.length || 0} tasks</p></div><Link className="lms-icon-link" to={`/learning/levels/${level.id}/sublevels/${subLevel.id}`} title="Open sub-level" aria-label="Open sub-level"><Play size={18} /></Link></div></CardBody></Card>)}</div>
    </div><AICopilot topic={subLevels[0]?.topic || level.title} task={subLevels[0]?.tasks?.[0]?.content || ''} language={level.language} stage={level.stage} levelId={level.id} levelNumber={level.levelNumber} /></div>
  </main>;
}
