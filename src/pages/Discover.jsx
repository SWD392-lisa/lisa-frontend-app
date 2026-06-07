import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { roomService } from '../services/roomService';
import '../pages/Home.css'; // Reuse rooms-grid

export const Discover = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    roomService.getAll().then(setRooms);
  }, []);

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 style={{ marginBottom: '24px' }}>Khám phá phòng học</h1>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1 }}>
          <Input 
            label="Tìm kiếm theo chủ đề, ngôn ngữ..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="primary-outlined" style={{ height: '56px' }}>
          <Filter size={20} /> Lọc
        </Button>
      </div>

      <div className="rooms-grid">
        {rooms.map(room => (
          <Card key={room.id}>
            <CardBody>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)' }}>{room.language} • {room.stage}</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 600, color: room.status === 'LIVE' ? 'var(--red)' : 'var(--text-black)' }}>
                  {room.status}
                </span>
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '8px' }}>{room.title}</h3>
              <p style={{ color: 'var(--text-black-soft)', fontSize: '1.4rem', marginBottom: '16px' }}>
                Mentor: {room.mentor.name}
              </p>
              <Link to={`/room/${room.id}`}>
                <Button variant="primary-filled" fullWidth>Tham gia</Button>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
