import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { lmsService } from '../services/lmsService';

export const Learning = () => {
  const [levels, setLevels] = useState([]);
  
  useEffect(() => {
    lmsService.getLevels('EN', 'u1').then(setLevels);
  }, []);

  return (
    <div className="container" style={{ padding: '32px 16px' }}>
      <h1 style={{ marginBottom: '8px' }}>Lộ trình học tập</h1>
      <p style={{ color: 'var(--text-black-soft)', marginBottom: '32px' }}>
        English (LISA) • Stage 1: Sơ cấp
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {levels.map(level => (
          <Card key={level.id}>
            <CardBody style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.4rem', color: 'var(--text-black-soft)', marginBottom: '4px' }}>
                  Level {level.id} • {level.status}
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 600 }}>{level.title}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--green-accent)' }}>
                  {level.progress_pct}%
                </div>
                <Button variant="primary-outlined" style={{ padding: '4px 12px', fontSize: '1.3rem', marginTop: '8px' }}>
                  Học ngay
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
