import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, CheckCircle2, Clock3, LoaderCircle, Mic,
  RotateCcw, Send, Square, Trophy, Volume2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { AICopilot } from '../components/lms/AICopilot';
import {
  assessSpeaking, getLevel, getLevels, getSpeakingAssessments, getSubLevels, saveLearnerProgress,
} from '../services/lmsApi';
import './LmsPages.css';

const initialAttempt = { transcript: '', speakingSeconds: 0, status: 'ready', error: '' };

export function SubLevelLearning() {
  const { levelId, subLevelId } = useParams();
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [subLevel, setSubLevel] = useState(null);
  const [doneTasks, setDoneTasks] = useState([]);
  const [practice, setPractice] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [nextStep, setNextStep] = useState(null);
  const recognitionRef = useRef(null);
  const startedAtRef = useRef(0);

  useEffect(() => {
    Promise.all([getLevel(levelId), getSubLevels(levelId), getSpeakingAssessments(subLevelId)])
      .then(([levelData, subs, savedAssessments]) => {
        const available = subs || levelData.subLevels || [];
        const selected = available.find((item) => String(item.id) === String(subLevelId));
        const savedPractice = Object.fromEntries((savedAssessments || []).map((assessment) => [
          assessment.taskId,
          {
            ...initialAttempt,
            transcript: assessment.transcript,
            speakingSeconds: assessment.speakingSeconds,
            status: 'scored',
            assessment,
          },
        ]));
        setSaved(false);
        setNextStep(null);
        setPractice(savedPractice);
        setLevel({ ...levelData, subLevels: available });
        setSubLevel(selected);
        setSeconds((selected?.durationMinutes || 0) * 60);
      })
      .catch((err) => setError(err.message));
  }, [levelId, subLevelId]);

  useEffect(() => {
    if (seconds <= 0 || saved) return undefined;
    const timer = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [seconds, saved]);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const tasks = useMemo(
    () => [...(subLevel?.tasks || [])].sort((a, b) => a.orderIndex - b.orderIndex),
    [subLevel],
  );
  const isEnglish = level?.language === 'ENGLISH';
  const speechSupported = typeof window !== 'undefined'
    && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const assessments = Object.values(practice).map((item) => item.assessment).filter(Boolean);
  const hasAssessment = assessments.length > 0;
  const speakingSeconds = assessments.reduce(
    (total, assessment) => total + (assessment.speakingSeconds || 0), 0,
  );

  const updatePractice = (taskId, values) => setPractice((current) => ({
    ...current,
    [taskId]: { ...initialAttempt, ...current[taskId], ...values },
  }));

  const speechErrorMessage = (code) => {
    if (code === 'not-allowed' || code === 'service-not-allowed') {
      return 'Microphone permission was denied. Allow microphone access and try again.';
    }
    if (code === 'no-speech') return 'No speech was detected. Try again in a quieter place.';
    if (code === 'audio-capture') return 'No microphone is available.';
    return 'Speech recognition stopped unexpectedly. Please try again.';
  };

  const startListening = (taskId) => {
    if (!speechSupported) {
      updatePractice(taskId, {
        status: 'error',
        error: 'This browser does not support speech recognition. Use a recent version of Chrome or Edge.',
      });
      return;
    }
    recognitionRef.current?.abort();
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    let captured = '';
    let failed = false;
    recognitionRef.current = recognition;
    updatePractice(taskId, {
      transcript: '', speakingSeconds: 0, status: 'listening', error: '',
    });
    recognition.onresult = (event) => {
      let interim = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0].transcript;
        if (event.results[index].isFinal) captured += `${text} `;
        else interim += text;
      }
      updatePractice(taskId, { transcript: `${captured}${interim}`.trimStart() });
    };
    recognition.onstart = (event) => { startedAtRef.current = event.timeStamp; };
    recognition.onerror = (event) => {
      failed = true;
      updatePractice(taskId, { status: 'error', error: speechErrorMessage(event.error) });
    };
    recognition.onend = (event) => {
      const duration = Math.max(
        1,
        Math.min(600, Math.round((event.timeStamp - startedAtRef.current) / 1000)),
      );
      if (!failed) updatePractice(taskId, { speakingSeconds: duration, status: 'ready' });
      recognitionRef.current = null;
    };
    try {
      recognition.start();
    } catch {
      updatePractice(taskId, {
        status: 'error', error: 'The microphone could not be started. Please try again.',
      });
    }
  };

  const submitAssessment = async (taskId) => {
    const attempt = practice[taskId] || initialAttempt;
    if (!attempt.transcript.trim()) {
      updatePractice(taskId, {
        status: 'error', error: 'Say or enter an answer before asking AI to score it.',
      });
      return;
    }
    updatePractice(taskId, { status: 'scoring', error: '' });
    try {
      const assessment = await assessSpeaking({
        taskId,
        transcript: attempt.transcript.trim(),
        speakingSeconds: Math.max(1, attempt.speakingSeconds || 1),
      });
      updatePractice(taskId, {
        transcript: assessment.transcript,
        speakingSeconds: assessment.speakingSeconds,
        assessment,
        status: 'scored',
      });
    } catch (err) {
      updatePractice(taskId, {
        status: 'error', error: err.message || 'AI scoring is temporarily unavailable.',
      });
    }
  };

  const resolveNextStep = async () => {
    const sorted = [...level.subLevels].sort((a, b) => a.subNumber - b.subNumber);
    const currentIndex = sorted.findIndex((item) => String(item.id) === String(subLevelId));
    if (currentIndex >= 0 && sorted[currentIndex + 1]) {
      return {
        label: 'Next sub-level',
        path: `/learning/levels/${level.id}/sublevels/${sorted[currentIndex + 1].id}`,
      };
    }
    try {
      const levels = (await getLevels(level.language)).sort((a, b) => a.levelNumber - b.levelNumber);
      const nextLevel = levels.find((item) => item.levelNumber > level.levelNumber);
      if (nextLevel) {
        const nextSubs = (nextLevel.subLevels?.length
          ? nextLevel.subLevels
          : await getSubLevels(nextLevel.id)).sort((a, b) => a.subNumber - b.subNumber);
        if (nextSubs[0]) {
          return {
            label: 'Next level',
            path: `/learning/levels/${nextLevel.id}/sublevels/${nextSubs[0].id}`,
          };
        }
      }
    } catch {
      // The roadmap is the safe destination when the next curriculum item cannot be resolved.
    }
    return { label: 'Back to roadmap', path: '/learning' };
  };

  const complete = async () => {
    setSaving(true);
    setError('');
    try {
      await saveLearnerProgress({
        levelId: Number(levelId),
        subLevelId: Number(subLevelId),
        completed: true,
        speakingSeconds,
      });
      setSaved(true);
      setNextStep(await resolveNextStep());
    } catch (err) {
      setError(err.message || 'Could not save progress.');
    } finally {
      setSaving(false);
    }
  };

  if (error && !level) return <div className="lms-state lms-state--error">{error}</div>;
  if (!level || !subLevel) {
    return <div className="lms-state"><LoaderCircle className="lms-spin" size={28} /> Loading lesson...</div>;
  }
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <main className="lms-page container">
      <button className="lms-back" onClick={() => navigate(`/learning/levels/${levelId}`)}>
        <ArrowLeft size={17} /> Back to level
      </button>
      <div className="lms-detail-layout">
        <div>
          <section className="lms-lesson-header">
            <div>
              <p className="lms-eyebrow">Level {level.levelNumber} / Sub-level {subLevel.subNumber}</p>
              <h1>{subLevel.topic}</h1>
            </div>
            <div className="lms-timer"><Clock3 size={18} /> {mins}:{secs}</div>
          </section>
          <div className="lms-task-list">
            {tasks.map((task, index) => {
              const attempt = practice[task.id] || initialAttempt;
              const listening = attempt.status === 'listening';
              return (
                <Card key={task.id}>
                  <CardBody>
                    <div className={`lms-task ${doneTasks.includes(task.id) ? 'is-done' : ''}`}>
                      <button
                        className="lms-task-check"
                        onClick={() => setDoneTasks((items) => (items.includes(task.id)
                          ? items.filter((id) => id !== task.id) : [...items, task.id]))}
                        aria-label="Mark task complete"
                      >
                        <CheckCircle2 size={22} />
                      </button>
                      <div className="lms-task-content">
                        <span className="lms-task-type">{task.taskType} / Task {index + 1}</span>
                        <p>{task.content}</p>
                        {task.pronunciation && (
                          <span className="lms-pronunciation">
                            <Volume2 size={14} /> {task.pronunciation}
                          </span>
                        )}
                        {isEnglish && (
                          <section className="lms-speaking-practice">
                            <div className="lms-speaking-toolbar">
                              <button
                                type="button"
                                className={`lms-mic-button ${listening ? 'is-listening' : ''}`}
                                onClick={() => (listening
                                  ? recognitionRef.current?.stop() : startListening(task.id))}
                                title={listening ? 'Stop recording' : 'Start speaking'}
                                aria-label={listening ? 'Stop recording' : 'Start speaking'}
                              >
                                {listening ? <Square size={20} /> : <Mic size={20} />}
                              </button>
                              <div>
                                <strong>
                                  {listening ? 'Listening...'
                                    : attempt.status === 'scoring' ? 'AI is scoring...'
                                      : attempt.assessment ? 'Best answer saved' : 'Practice your answer'}
                                </strong>
                                <span>{attempt.speakingSeconds ? `${attempt.speakingSeconds} seconds` : 'Speak in English'}</span>
                              </div>
                            </div>
                            <textarea
                              aria-label={`Transcript for task ${index + 1}`}
                              value={attempt.transcript}
                              onChange={(event) => updatePractice(task.id, {
                                transcript: event.target.value,
                                status: 'ready',
                                error: '',
                              })}
                              placeholder="Your speech transcript will appear here. You can edit it before scoring."
                              disabled={listening || attempt.status === 'scoring'}
                            />
                            <div className="lms-speaking-actions">
                              <Button
                                variant="primary-outlined"
                                onClick={() => startListening(task.id)}
                                disabled={listening || attempt.status === 'scoring'}
                              >
                                <RotateCcw size={16} /> Record again
                              </Button>
                              <Button
                                onClick={() => submitAssessment(task.id)}
                                disabled={listening || attempt.status === 'scoring' || !attempt.transcript.trim()}
                              >
                                {attempt.status === 'scoring'
                                  ? <LoaderCircle className="lms-spin" size={16} /> : <Send size={16} />}
                                Score answer
                              </Button>
                            </div>
                            {attempt.error && <p className="lms-speaking-error">{attempt.error}</p>}
                            {attempt.assessment && (
                              <div className="lms-score-result">
                                <div className="lms-score-overall">
                                  <Trophy size={20} /><strong>{attempt.assessment.overallScore}</strong><span>/100</span>
                                </div>
                                <div className="lms-score-breakdown">
                                  <span>Relevance <strong>{attempt.assessment.relevanceScore}</strong></span>
                                  <span>Grammar <strong>{attempt.assessment.grammarScore}</strong></span>
                                  <span>Vocabulary <strong>{attempt.assessment.vocabularyScore}</strong></span>
                                </div>
                                <p><strong>AI feedback</strong>{attempt.assessment.feedback}</p>
                                <p><strong>Suggested answer</strong>{attempt.assessment.suggestedAnswer}</p>
                                {!attempt.assessment.isPersonalBest && (
                                  <span className="lms-best-note">Your previous best score was kept.</span>
                                )}
                              </div>
                            )}
                          </section>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
          <div className="lms-complete-bar">
            <div>
              <strong>{isEnglish ? `${speakingSeconds} speaking seconds saved` : 'Ready to finish?'}</strong>
              {isEnglish && !hasAssessment && (
                <span>Complete at least one AI speaking practice to finish this sub-level.</span>
              )}
            </div>
            {saved && nextStep ? (
              <Button onClick={() => navigate(nextStep.path)}>
                {nextStep.label} <ArrowRight size={16} />
              </Button>
            ) : (
              <Button onClick={complete} disabled={saving || saved || (isEnglish && !hasAssessment)}>
                {saving ? <LoaderCircle className="lms-spin" size={16} /> : <CheckCircle2 size={16} />}
                {saved ? 'Saved' : 'Complete sub-level'}
              </Button>
            )}
          </div>
          {error && <p className="lms-inline-error">{error}</p>}
        </div>
        <AICopilot
          topic={subLevel.topic}
          task={tasks[0]?.content || ''}
          language={level.language}
          stage={level.stage}
          levelId={level.id}
          levelNumber={level.levelNumber}
        />
      </div>
    </main>
  );
}
