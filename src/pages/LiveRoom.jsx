import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomService } from '../services/roomService';
import { Button } from '../components/ui/Button';
import { Users, Mic, MicOff, Hand, Gift, X } from 'lucide-react';
import './LiveRoom.css';

export const LiveRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);

  useEffect(() => {
    roomService.getById(id).then(setRoom);
  }, [id]);

  if (!room) return <div style={{ padding: '40px' }}>Loading room...</div>;

  return (
    <div className="live-room bg-house-green text-white">
      {/* Header */}
      <header className="room-header">
        <div>
          <h1 className="text-white" style={{ fontSize: '2rem', marginBottom: '4px' }}>{room.title}</h1>
          <span style={{ color: 'var(--text-white-soft)', fontSize: '1.4rem' }}>
            {room.language} • {room.stage} • 15:00
          </span>
        </div>
        <button onClick={() => navigate(-1)} className="close-btn">
          <X size={24} color="#fff" />
        </button>
      </header>

      {/* Main Area */}
      <main className="room-main">
        {/* Mentor Stage */}
        <div className="stage-area">
          <div className="avatar-wrapper is-speaking">
            <div className="avatar">🧑‍🏫</div>
            <span className="avatar-name">{room.mentor.name} (Mentor)</span>
          </div>
        </div>

        {/* Speakers / Audience */}
        <div className="audience-area">
          <div className="section-title">
            <Users size={16} /> Khán giả ({room.participants_count})
          </div>
          <div className="audience-grid">
            {/* Generate some dummy audience avatars */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="avatar-wrapper small">
                <div className="avatar">👤</div>
                <span className="avatar-name">Guest</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Controls */}
      <footer className="room-controls">
        <Button 
          variant="inverted" 
          style={{ 
            padding: '12px', 
            borderRadius: '50%',
            backgroundColor: isHandRaised ? 'var(--gold)' : 'var(--white)',
            borderColor: isHandRaised ? 'var(--gold)' : 'var(--white)'
          }}
          onClick={() => setIsHandRaised(!isHandRaised)}
        >
          <Hand size={24} color={isHandRaised ? '#fff' : 'var(--text-black)'} />
        </Button>
        <Button 
          variant="inverted" 
          style={{ padding: '12px', borderRadius: '50%', backgroundColor: isMuted ? 'var(--red)' : 'var(--white)', border: 'none' }}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="var(--green-accent)" />}
        </Button>
        <Button variant="inverted" style={{ padding: '12px', borderRadius: '50%' }}>
          <Gift size={24} />
        </Button>
      </footer>
    </div>
  );
};
