import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { apiFetch } from '../api/client';

const statusStyles = {
  '모집 중': { text: '#24a148', border: '#24a148', bg: '#e7f6ed' },
  '모집 마감': { text: '#caa300', border: '#caa300', bg: '#fff4d6' },
  '놀이 진행 중': { text: '#e74c3c', border: '#e74c3c', bg: '#fde2df' },
  종료: { text: '#777', border: '#d0d0d0', bg: '#f5f5f5' },
};

const getStatusStyle = (status) => statusStyles[status] || statusStyles['모집 중'];

const JoinedPlaysScreen = () => {
  const navigate = useNavigate();
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/api/v1/posts/mine')
      .then((data) => {
        const onlyFinished = (data || []).filter((item) => (item.status || '') === '종료');
        setJoined(onlyFinished);
      })
      .catch(() => setError('참여한 놀이를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: '1px solid #e6e6e6',
            background: '#fff',
            borderRadius: 10,
            padding: '6px 10px',
            cursor: 'pointer',
            fontWeight: 800,
            color: '#444',
          }}
        >
          ←
        </button>
        <div style={{ fontWeight: 900, fontSize: 18 }}>내가 참여한 놀이</div>
      </div>

      <div style={{ padding: '0 16px', marginTop: 6 }}>
        {loading ? (
          <div style={{ padding: '18px 4px', textAlign: 'center', color: '#888' }}>불러오는 중...</div>
        ) : error ? (
          <div style={{ padding: '18px 4px', textAlign: 'center', color: '#c75f63', fontWeight: 700 }}>{error}</div>
        ) : joined.length === 0 ? (
          <div
            style={{
              background: '#f9f9f9',
              color: '#888',
              padding: '14px 16px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            아직 참여했던 놀이가 없어요.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {joined.map((item) => {
              const style = getStatusStyle(item.status || '모집 중');
              return (
                <div
                  key={item.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #ededed',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                  }}
                  onClick={() => navigate(`/play/${encodeURIComponent(item.title)}`, { state: item })}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      background: item.image_url ? 'transparent' : '#f36f72',
                      color: item.image_url ? 'transparent' : 'white',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 900,
                      overflow: 'hidden',
                      border: item.image_url ? '1px solid #f36f72' : 'none',
                    }}
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      item.title?.slice(0, 2) || '놀이'
                    )}
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontWeight: 900, fontSize: 15 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#777' }}>{item.location_name || '장소 미정'}</div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: style.text,
                      border: `1px solid ${style.border}`,
                      background: style.bg,
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.status || '모집 중'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default JoinedPlaysScreen;
