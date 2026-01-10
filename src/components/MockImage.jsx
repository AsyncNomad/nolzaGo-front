import React from 'react';

const gradients = [
  'linear-gradient(135deg, #f8d7da, #f5a4ac)',
  'linear-gradient(135deg, #c2e9fb, #81a4fd)',
  'linear-gradient(135deg, #fceabb, #f8b500)',
  'linear-gradient(135deg, #d4fc79, #96e6a1)',
  'linear-gradient(135deg, #cfd9df, #e2ebf0)',
  'linear-gradient(135deg, #d9afd9, #97d9e1)',
];

const MockImage = ({ label = '', size = 70, corner = 12 }) => {
  const bg = gradients[label.length % gradients.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: corner,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2f2f2f',
        fontWeight: 800,
        fontSize: Math.max(12, Math.min(18, 200 / String(label).length)),
        textAlign: 'center',
        padding: 6,
      }}
    >
      {label || 'IMG'}
    </div>
  );
};

export default MockImage;
