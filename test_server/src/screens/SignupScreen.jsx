import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignupScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell coral-panel">
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#f5f5f5',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#fff',
              display: 'grid',
              placeItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: '#f36f72',
                display: 'grid',
                placeItems: 'center',
                color: 'white',
                fontWeight: 900,
              }}
            >
              🐰
            </div>
          </div>
        </div>
        <input className="input" placeholder="닉네임을 입력해주세요." style={{ marginTop: 10 }} />
        <button
          className="button white"
          style={{ color: '#5f5f5f', fontWeight: 700 }}
          onClick={() => navigate('/location-confirm')}
        >
          동네 인증하기
        </button>
        <div style={{ textAlign: 'center', fontSize: 13, marginTop: -4 }}>현재 나의 위치 설정을 켜주세요</div>
        <button className="button white" style={{ marginTop: 10 }} onClick={() => navigate('/home')}>
          입장하기
        </button>
      </div>
    </div>
  );
};

export default SignupScreen;
