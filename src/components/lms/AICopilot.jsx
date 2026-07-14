import React, { useState } from 'react';
import { Copy, Heart, Lightbulb, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react';
import { getAiSuggestions } from '../../services/lmsApi';
import './AICopilot.css';

export function AICopilot({
  topic = '',
  task = '',
  language = 'ENGLISH',
  stage,
  levelId,
  levelNumber,
  compact = false,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('lucy_ai_favorites') || '[]'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const suggestion = suggestions[index] || null;
  const isFavorite = suggestion ? favorites.includes(suggestion.content) : false;
  const canGenerate = Boolean(topic.trim() && task.trim());

  const generate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError('');
    try {
      const result = await getAiSuggestions({ language, stage, levelId, levelNumber, topic, task, count: 5 });
      setSuggestions(result.suggestions || []);
      setProvider(result.provider || 'MIMO');
      setModel(result.model || 'MiMo-V2-Flash');
      setIndex(0);
    } catch (err) {
      setError(err.message || 'AI suggestions are temporarily unavailable.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorite = () => {
    if (!suggestion) return;
    const next = isFavorite
      ? favorites.filter((item) => item !== suggestion.content)
      : [...favorites, suggestion.content];
    setFavorites(next);
    localStorage.setItem('lucy_ai_favorites', JSON.stringify(next));
  };

  const copy = async () => {
    if (suggestion) await navigator.clipboard?.writeText(suggestion.content);
  };

  return <aside className={`ai-copilot ${compact ? 'ai-copilot--compact' : ''}`}>
    <div className="ai-copilot__header">
      <span><Lightbulb size={18} /> LUCY AI Copilot</span>
      <span className="ai-preview-badge">{provider ? `${provider} AI` : 'AI Ready'}</span>
    </div>
    <p className="ai-copilot__topic">Topic: {topic || 'N/A'}</p>
    {suggestion ? <>
      <p className="ai-copilot__suggestion">{suggestion.content}</p>
      <p className="ai-copilot__note">Focus: {suggestion.focus || 'speaking'} · {model}</p>
      <div className="ai-copilot__actions">
        <button onClick={() => setIndex((value) => (value + 1) % suggestions.length)} title="Change suggestion" aria-label="Change suggestion"><RefreshCw size={16} /></button>
        <button className={isFavorite ? 'is-active' : ''} onClick={saveFavorite} title="Favorite suggestion" aria-label="Favorite suggestion"><Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} /></button>
        <button onClick={copy} title="Copy suggestion" aria-label="Copy suggestion"><Copy size={16} /></button>
        <button onClick={generate} disabled={loading} title="Generate again" aria-label="Generate again"><Sparkles size={16} /></button>
      </div>
    </> : <>
      <p className="ai-copilot__suggestion ai-copilot__suggestion--empty">Generate a speaking suggestion for this lesson.</p>
      <p className="ai-copilot__note">MiMo receives curriculum context only. No learner identity or audio is sent.</p>
      <button className="ai-copilot__generate" onClick={generate} disabled={!canGenerate || loading}>{loading ? <LoaderCircle className="lms-spin" size={16} /> : <Sparkles size={16} />} {loading ? 'Generating...' : 'Generate suggestions'}</button>
    </>}
    {error && <p className="ai-copilot__error">{error}</p>}
  </aside>;
}
