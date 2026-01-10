import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setToken } from '../api/client';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [kakaoReady, setKakaoReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = document.getElementById('kakao-sdk');
    if (existing) {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
      }
      setKakaoReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'kakao-sdk';
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_APP_KEY);
      }
      setKakaoReady(true);
    };
    document.body.appendChild(script);
  }, []);

  const handleKakaoLogin = () => {
    if (!window.Kakao || !kakaoReady || loading) return;
    setLoading(true);
    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const data = await apiFetch('/api/v1/auth/kakao', {
            method: 'POST',
            body: JSON.stringify({ access_token: authObj.access_token }),
          });
          if (data?.access_token) {
            setToken(data.access_token);
            navigate('/home');
          }
        } catch (err) {
          console.error(err);
          alert('카카오 로그인에 실패했습니다.');
        }
        setLoading(false);
      },
      fail: (err) => {
        console.error(err);
        alert('카카오 로그인에 실패했습니다.');
        setLoading(false);
      },
    });
  };

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
          onClick={handleKakaoLogin}
          disabled={!kakaoReady || loading}
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
          {loading ? '로그인 중...' : '카카오 로그인'}
        </button>
        <button className="button white" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
