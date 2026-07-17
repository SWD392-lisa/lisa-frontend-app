import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { roomService } from '../services/roomService';
import { Users, Headphones } from 'lucide-react';
import './Home.css';

export const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [recommendedRooms, setRecommendedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const roomMentorName = (room) => room.mentor?.name || room.hostDisplayName || 'Mentor';
  const roomParticipantCount = (room) => room.participants_count ?? room.participantCount ?? 0;
  const roomMaxParticipants = (room) => room.max_participants ?? room.maxParticipants ?? '—';

  useEffect(() => {
    const fetchRooms = async () => {
      const [featured, recommended] = await Promise.all([
        roomService.getFeatured(),
        roomService.getRecommended('Sơ cấp')
      ]);
      setFeaturedRooms(featured);
      setRecommendedRooms(recommended);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  if (loading) return <div className="container" style={{ padding: '40px 16px' }}>Loading...</div>;

  return (
    <div className="home-page">
      {/* Hero Section / Featured */}
      <section className="bg-house-green" style={{ padding: '40px 0', color: 'var(--white)' }}>
        <div className="container">
          <h1 className="text-white" style={{ marginBottom: '8px' }}>LUCY Live Audio</h1>
          <p className="text-white-soft" style={{ fontSize: '1.9rem', marginBottom: '24px' }}>
            Tham gia các phòng thảo luận và luyện tập ngôn ngữ cùng mentor.
          </p>
          <div className="rooms-grid">
            {featuredRooms.map(room => (
              <Card key={room.id} variant="dark" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.4rem', color: 'var(--gold)' }}>{room.language} • {room.stage}</span>
                    {room.status === 'LIVE' && <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>● LIVE</span>}
                  </div>
                  <h2 className="text-white" style={{ fontSize: '2rem', marginBottom: '16px' }}>{room.title}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', color: 'var(--text-white-soft)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={16} /> {roomParticipantCount(room)}/{roomMaxParticipants(room)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Headphones size={16} /> {roomMentorName(room)}</span>
                  </div>
                  <Link to={`/room/${room.lmsSessionId || room.id}`} style={{ display: 'block' }}>
                    <Button variant="inverted" fullWidth>Tham gia ngay</Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="container" style={{ padding: '48px 16px' }}>
        <h2 style={{ marginBottom: '24px' }}>Phòng phù hợp với bạn</h2>
        <div className="rooms-grid">
          {recommendedRooms.map(room => (
            <Card key={room.id}>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>{room.language || 'Live room'} • Level {room.level_id || room.level || '—'}</span>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '8px' }}>{room.title}</h3>
                <p style={{ color: 'var(--text-black-soft)', fontSize: '1.4rem', marginBottom: '16px' }}>
                  Mentor: {roomMentorName(room)}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>{roomParticipantCount(room)} người nghe</span>
                  <Link to={`/room/${room.lmsSessionId || room.id}`}>
                    <Button variant="primary-outlined">Chi tiết</Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
