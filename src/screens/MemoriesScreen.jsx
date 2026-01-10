import React from 'react';
import BottomNav from '../components/BottomNav';

const placeholders = Array.from({ length: 21 });

const MemoriesScreen = () => {
  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 90 }}>
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
