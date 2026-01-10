import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell coral-panel">
      <div
        className="panel"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginTop: 20,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2 }}>놀자Go</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 6 }}>손쉬운 우리동네 놀이팟 모집 서비스</div>
        </div>
        <input className="input" placeholder="아이디를 입력해주세요." />
        <input className="input" placeholder="비밀번호를 입력해주세요." type="password" />
        <button className="button white" onClick={() => navigate('/home')}>
          로그인
        </button>
        <button
          className="button white"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          onClick={() => navigate('/home')}
        >
          <span
            style={{
              background: '#fcd800',
              width: 24,
              height: 24,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              color: '#2b2b2b',
              fontSize: 13,
            }}
          >
            K
          </span>
          카카오 로그인
        </button>
        <button className="button white" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
