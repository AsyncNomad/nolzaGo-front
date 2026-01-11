import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const placeholders = Array.from({ length: 21 });

const MemoriesScreen = () => {
  const navigate = useNavigate();

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
      <div className="memory-grid">
        {placeholders.map((_, idx) => (
          <div key={idx} className="memory-tile" aria-label={`memory placeholder ${idx + 1}`} />
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default MemoriesScreen;
