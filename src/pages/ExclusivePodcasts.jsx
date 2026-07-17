import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Play, Lock } from 'lucide-react';
import { getPodcastPlaybackUrl, getPodcasts } from '../services/realtimeService';
import './ExclusivePodcasts.css';

export const ExclusivePodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    getPodcasts()
      .then(setPodcasts)
      .catch((err) => setError(err.message || 'Could not load podcasts.'))
      .finally(() => setLoading(false));
    return () => audioRef.current?.pause();
  }, []);

  const playPodcast = async (podcast) => {
    try {
      const playback = await getPodcastPlaybackUrl(podcast.podcastId);
      audioRef.current?.pause();
      const audio = new Audio(playback.playbackUrl);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      await audio.play();
      setPlayingId(podcast.podcastId);
    } catch (err) {
      setError(err.message || 'Could not play podcast.');
    }
  };

  return (
    <div className="podcasts-page">
      <div className="podcasts-container">
        <div className="podcasts-header">
          <div className="podcasts-title-row">
            <h1 className="podcasts-title">Exclusive Podcasts</h1>
            <Volume2 size={32} className="wave-sound-icon" />
          </div>
          <p className="podcasts-subtitle">Published recordings from LUCY learning rooms.</p>
        </div>
        {loading && <p className="podcasts-subtitle">Loading podcasts...</p>}
        {error && <p className="podcasts-subtitle" role="alert">{error}</p>}
        {!loading && !error && podcasts.length === 0 && <p className="podcasts-subtitle">No published podcasts yet.</p>}
        <div className="podcasts-list">
          {podcasts.map((podcast) => (
            <div key={podcast.podcastId} className="podcast-horizontal-card">
              <div className="podcast-cover-left">
                <img src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=150&h=150&fit=crop" alt={podcast.title} className="podcast-cover-image" />
                <button className="play-circle-overlay" onClick={() => playPodcast(podcast)} aria-label="Play podcast">
                  <Play size={20} style={{ fill: '#FFFFFF', marginLeft: '3px' }} />
                </button>
              </div>
              <div className="podcast-info-middle">
                <h3 className="podcast-title-text">{podcast.title}</h3>
                <p className="podcast-host-text">Creator {podcast.creatorUserId}</p>
                <div className="podcast-progress-track">
                  <div className="podcast-progress-fill" style={{ width: playingId === podcast.podcastId ? '100%' : '0%' }} />
                </div>
              </div>
              <div className="podcast-action-right">
                <div className="podcast-premium-badge"><Lock size={12} style={{ marginRight: '4px' }} /> Published</div>
                <button className="podcast-unlock-btn" onClick={() => playPodcast(podcast)}>
                  {playingId === podcast.podcastId ? 'Playing' : 'Listen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
