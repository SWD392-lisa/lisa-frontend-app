import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, Circle, LoaderCircle, RefreshCw } from 'lucide-react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { getLearnerProgress, getLevels } from '../services/lmsApi';
import './LmsPages.css';

const LANGUAGES = [
  { value: 'ENGLISH', label: 'English' },
  { value: 'CHINESE', label: 'Chinese' },
  { value: 'JAPANESE', label: 'Japanese' },
];
const STAGES = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Intermediate' },
  { value: 3, label: 'Advanced' },
];

function ErrorState({ message, onRetry }) {
  return <div className="lms-state lms-state--error">
    <RefreshCw size={28} />
    <strong>Could not load learning roadmap</strong>
    <span>{message}</span>
    <Button onClick={onRetry}><RefreshCw size={16} /> Retry</Button>
  </div>;
}

export const Learning = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('ENGLISH');
  const [selectedStage, setSelectedStage] = useState(1);
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [levelData, progressData] = await Promise.all([
        getLevels(selectedLanguage, selectedStage),
        getLearnerProgress(),
      ]);
      setLevels(levelData || []);
      setProgress(progressData || []);
    } catch (err) {
      setError(err.message || 'The LMS service is unavailable.');
      setLevels([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, selectedStage]);

  useEffect(() => { load(); }, [load]);

  const progressByLevel = useMemo(() => {
    const map = new Map();
    progress.forEach((item) => {
      const current = map.get(item.levelId) || { completed: 0, total: 0, speakingSeconds: 0 };
      map.set(item.levelId, {
        completed: current.completed + (item.completed ? 1 : 0),
        total: current.total + 1,
        speakingSeconds: current.speakingSeconds + (item.speakingSeconds || 0),
      });
    });
    return map;
  }, [progress]);

  return <main className="lms-page container">
    <div className="lms-page__heading">
      <div>
        <p className="lms-eyebrow"><BookOpen size={16} /> LUCY LMS</p>
        <h1>Learning Roadmap</h1>
        <p className="lms-muted">Build your speaking habit one level at a time.</p>
      </div>
      <Link to="/learning/progress" className="lms-link-button">View progress <ChevronRight size={16} /></Link>
    </div>

    <div className="lms-toolbar">
      <div className="lms-selector-group">
        <span className="lms-label">Language</span>
        <div className="lms-scroll-tabs">
          {LANGUAGES.map((language) => <button key={language.value} className={`lms-tab ${selectedLanguage === language.value ? 'is-active' : ''}`} onClick={() => setSelectedLanguage(language.value)}>{language.label}</button>)}
        </div>
      </div>
      <div className="lms-selector-group">
        <span className="lms-label">Stage</span>
        <div className="lms-scroll-tabs">
          {STAGES.map((stage) => <button key={stage.value} className={`lms-tab ${selectedStage === stage.value ? 'is-active' : ''}`} onClick={() => setSelectedStage(stage.value)}>{stage.label}</button>)}
        </div>
      </div>
    </div>

    {loading && <div className="lms-state"><LoaderCircle className="lms-spin" size={28} /><span>Loading levels...</span></div>}
    {!loading && error && <ErrorState message={error} onRetry={load} />}
    {!loading && !error && levels.length === 0 && <div className="lms-state"><Circle size={28} /><strong>No levels found</strong><span>This language and stage have no imported curriculum yet.</span></div>}
    {!loading && !error && levels.length > 0 && <div className="lms-level-grid">
      {levels.map((level) => {
        const item = progressByLevel.get(level.id);
        const percent = item?.total ? Math.min(100, Math.round((item.completed / item.total) * 100)) : 0;
        const status = percent === 100 ? 'Completed' : percent > 0 ? 'In progress' : 'Not started';
        return <Card key={level.id} className="lms-level-card">
          <CardBody>
            <div className="lms-level-card__top"><span className="lms-level-number">Level {level.levelNumber}</span><span className={`lms-status lms-status--${status.toLowerCase().replace(' ', '-')}`}>{status}</span></div>
            <h2>{level.title}</h2>
            <p className="lms-muted">{level.cefrTarget || 'CEFR target N/A'} <span aria-hidden="true">·</span> {level.durationMinutes || 'N/A'} minutes</p>
            <div className="lms-progress"><span style={{ width: `${percent}%` }} /></div>
            <div className="lms-level-card__footer"><span>{percent}% complete</span><Link to={`/learning/levels/${level.id}`} className="lms-icon-link" aria-label={`Open level ${level.levelNumber}`} title="Open level"><ChevronRight size={20} /></Link></div>
          </CardBody>
        </Card>;
      })}
    </div>}
  </main>;
};
