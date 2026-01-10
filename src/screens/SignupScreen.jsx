import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setToken } from '../api/client';

const SignupScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null); // null | 'ok' | 'exists'
  const [nickStatus, setNickStatus] = useState(null);
  const passwordTooLong = password.length > 72 || passwordConfirm.length > 72;
  const passwordMatch = password && passwordConfirm && password === passwordConfirm && !passwordTooLong;
  const canProceed =
    email &&
    password &&
    passwordConfirm &&
    nickname &&
    emailStatus === 'ok' &&
    nickStatus === 'ok' &&
    passwordMatch &&
    !passwordTooLong;

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
        <input
          className="input"
          placeholder="아이디(이메일)를 입력해주세요."
          style={{ marginTop: 10, color: '#ca6b6b' }}
          value={email}
          onChange={async (e) => {
            const val = e.target.value.trim();
            setEmail(val);
            setEmailStatus(null);
            if (val.length === 0) return;
            try {
              const res = await apiFetch(`/api/v1/auth/check-email?email=${encodeURIComponent(val)}`);
              setEmailStatus(res.available ? 'ok' : 'exists');
            } catch (err) {
              console.error(err);
              setEmailStatus(null);
            }
          }}
        />
        {emailStatus === 'exists' ? <div style={{ color: 'white', fontSize: 12 }}>이미 존재하는 아이디에요.</div> : null}
        {emailStatus === 'ok' ? <div style={{ color: 'white', fontSize: 12 }}>사용 가능한 아이디에요.</div> : null}
        <input
          className="input"
          placeholder="닉네임을 입력해주세요."
          style={{ marginTop: 10 }}
          value={nickname}
          onChange={async (e) => {
            const val = e.target.value.trim();
            setNickname(val);
            setNickStatus(null);
            if (val.length === 0) return;
            try {
              const res = await apiFetch(`/api/v1/auth/check-nickname?display_name=${encodeURIComponent(val)}`);
              setNickStatus(res.available ? 'ok' : 'exists');
            } catch (err) {
              console.error(err);
              setNickStatus(null);
            }
          }}
        />
        {nickStatus === 'exists' ? (
          <div style={{ color: 'white', fontSize: 12 }}>이미 존재하는 닉네임이에요.</div>
        ) : null}
        {nickStatus === 'ok' ? (
          <div style={{ color: 'white', fontSize: 12 }}>사용 가능한 닉네임이에요.</div>
        ) : null}
        <input
          className="input"
          placeholder="비밀번호를 입력해주세요."
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ color: '#ca6b6b' }}
        />
        <input
          className="input"
          placeholder="비밀번호를 재입력해주세요."
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          style={{ color: '#ca6b6b' }}
        />
        {passwordTooLong ? (
          <div style={{ color: 'white', fontSize: 12 }}>비밀번호는 72자 이내여야 해요.</div>
        ) : null}
        {!passwordMatch && passwordConfirm && !passwordTooLong ? (
          <div style={{ color: 'white', fontSize: 12 }}>비밀번호가 일치하지 않아요.</div>
        ) : null}
        <button
          className="button white"
          style={{
            color: canProceed ? '#5f5f5f' : '#9c9c9c',
            fontWeight: 700,
            background: canProceed ? '#ffffff' : '#f5b4b6',
          }}
          onClick={() =>
            navigate('/location-confirm', {
              state: {
                email,
                password,
                passwordConfirm,
                nickname,
              },
            })
          }
          disabled={!canProceed}
        >
          동네 인증하기
        </button>
        <div style={{ textAlign: 'center', fontSize: 13, marginTop: -4 }}>동네 인증을 완료하면 바로 입장해요.</div>
      </div>
    </div>
  );
};

export default SignupScreen;
