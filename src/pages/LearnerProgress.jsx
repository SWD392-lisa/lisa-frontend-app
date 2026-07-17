import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CheckCircle2, Clock3, LoaderCircle, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getLearnerProgress } from '../services/lmsApi';
import './LmsPages.css';

export function LearnerProgress() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setItems(await getLearnerProgress()); } catch (err) { setError(err.message || 'Could not load progress.'); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const summary = useMemo(() => ({ completed: items.filter((item) => item.completed).length, speaking: Math.round(items.reduce((sum, item) => sum + (item.speakingSeconds || 0), 0) / 60) }), [items]);
  if (loading) return <div className="lms-state"><LoaderCircle className="lms-spin" size={28} /> Loading progress...</div>;
  if (error) return <div className="lms-page container"><div className="lms-state lms-state--error"><strong>Could not load progress</strong><span>{error}</span><Button onClick={load}><RefreshCw size={16} /> Retry</Button></div></div>;
  return <main className="lms-page container"><div className="lms-page__heading"><div><p className="lms-eyebrow"><BarChart3 size={16} /> LEARNER PROGRESS</p><h1>Your progress</h1><p className="lms-muted">Progress comes from completed LMS sub-levels only.</p></div><Link className="lms-link-button" to="/learning">Roadmap</Link></div><div className="lms-stat-grid"><Card><CardBody><strong>{summary.completed}</strong><span>Completed sub-levels</span></CardBody></Card><Card><CardBody><strong>{summary.speaking}</strong><span>Speaking minutes</span></CardBody></Card><Card><CardBody><strong>{items.length ? `${Math.round((summary.completed / items.length) * 100)}%` : 'N/A'}</strong><span>Tracked completion</span></CardBody></Card></div>{items.length === 0 ? <div className="lms-state"><Clock3 size={28} /><strong>No progress yet</strong><span>Complete a sub-level to see it here.</span></div> : <div className="lms-history"><h2>Progress history</h2>{items.map((item) => <Card key={`${item.levelId}-${item.subLevelId}`}><CardBody><div className="lms-history-row"><div><strong>Level {item.levelId} · Sub-level {item.subLevelId}</strong><p className="lms-muted"><Clock3 size={14} /> {Math.round((item.speakingSeconds || 0) / 60)} speaking minutes</p></div><span className={item.completed ? 'lms-complete' : 'lms-muted'}>{item.completed ? <><CheckCircle2 size={16} /> Completed</> : 'In progress'}</span></div></CardBody></Card>)}</div>}</main>;
}
