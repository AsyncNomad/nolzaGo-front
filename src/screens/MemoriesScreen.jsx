import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { apiFetch } from '../api/client';

const MemoriesScreen = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await apiFetch('/api/v1/memories');
        if (!mounted) return;
        setMemories(data || []);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError('추억을 불러올 수 없어요.');
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 90 }}>
      <button
        style={{
          position: 'fixed',
          right: 22,
          bottom: 92,
          width: 62,
          height: 62,
          borderRadius: '50%',
          border: 'none',
          background: '#f36f72',
          color: 'white',
          fontSize: 28,
          boxShadow: '0 12px 18px rgba(0,0,0,0.18)',
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="추억 작성"
        onClick={() => navigate('/memories/create')}
      >
        +
      </button>

      {error ? (
        <div style={{ padding: 16, textAlign: 'center', color: '#c75f63', fontWeight: 700 }}>{error}</div>
      ) : memories.length === 0 ? (
        <div style={{ padding: 16, textAlign: 'center', color: '#888', fontWeight: 700 }}>아직 추억이 없어요.</div>
      ) : (
        <div className="memory-grid">
          {memories.map((m) => {
            const hasImage = !!m.image_url;
            return (
              <div
                key={m.id}
                className="memory-tile"
                style={
                  hasImage
                    ? {
                        backgroundImage: `url(${m.image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid #e2e2e2',
                      }
                    : undefined
                }
                aria-label={m.title}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/memories/${m.id}`, { state: m })}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    navigate(`/memories/${m.id}`, { state: m });
                  }
                }}
              />
            );
          })}
        </div>
      )}
      <BottomNav />
    </div>
  );
};

export default MemoriesScreen;
