import React from 'react';
import { BackIcon, HomeIcon } from '../assets/icons';

const TopBar = ({ title, variant = 'home', onBack }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px' }}>
    {variant === 'back' ? (
      <button
        onClick={onBack}
        style={{
          border: 'none',
          background: 'transparent',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        aria-label="뒤로가기"
      >
        <BackIcon color="#2f2f2f" />
      </button>
    ) : (
      <HomeIcon color="#f7f7f7" />
    )}
    {title ? (
      <span style={{ fontWeight: 900, fontSize: 14, color: variant === 'back' ? '#999' : '#f5f5f5' }}>
        {title}
      </span>
    ) : null}
  </div>
);

export default TopBar;
