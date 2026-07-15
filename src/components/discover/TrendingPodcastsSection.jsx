import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Headphones } from 'lucide-react';
import { getPodcastPlaybackUrl, getPodcasts } from '../../services/realtimeService';

export const TrendingPodcastsSection = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    getPodcasts().then(setPodcasts).catch(() => setPodcasts([]));
    return () => audioRef.current?.pause();
  }, []);

  const togglePlay = async (podcast) => {
    if (playingId === podcast.podcastId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    const playback = await getPodcastPlaybackUrl(podcast.podcastId);
    audioRef.current?.pause();
    const audio = new Audio(playback.playbackUrl);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    await audio.play();
    setPlayingId(podcast.podcastId);
  };

  return (
    <section className="podcasts-section">
      <div className="podcasts-section-header" style={{ display: 'block', textAlign: 'center', marginBottom: '40px' }}>
        <span className="section-subtitle-tag" style={{ display: 'inline-block', margin: '0 auto 8px' }}>Audio Library</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <Headphones className="text-green-accent" size={32} style={{ color: 'var(--green-accent)' }} />
          <h2 className="section-title" style={{ margin: 0 }}>Published Podcasts</h2>
        </div>
      </div>
      <div className="podcast-list">
        {podcasts.map((podcast) => {
          const isPlaying = playingId === podcast.podcastId;
          return (
            <div key={podcast.podcastId} className={`podcast-item ${isPlaying ? 'is-playing' : ''}`}>
              <button onClick={() => togglePlay(podcast)} className="play-btn" aria-label={isPlaying ? 'Pause podcast' : 'Play podcast'}>
                {isPlaying ? <Pause size={20} style={{ fill: 'currentColor' }} /> : <Play size={20} style={{ fill: 'currentColor', marginLeft: '2px' }} />}
              </button>
              <div className="podcast-info">
                <h3 className="podcast-title">{podcast.title}</h3>
                <p className="podcast-meta">Creator {podcast.creatorUserId} - {Math.round((podcast.durationSeconds || 0) / 60)}m</p>
              </div>
              <div className="podcast-badge">{isPlaying ? 'Playing' : 'Published'}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
