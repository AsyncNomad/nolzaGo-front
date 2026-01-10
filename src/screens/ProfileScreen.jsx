import React, { useEffect, useState } from 'react';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';
import { apiFetch } from '../api/client';

const recent = ['자전거', '하우스', '공구'];

const ProfileScreen = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch('/api/v1/auth/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const initial = user?.display_name?.[0] || '?';

  return (
    <div className="mobile-shell light-panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#ffe1e1',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              color: '#f36f72',
              fontSize: 20,
            }}
          >
            {user?.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt="프로필"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              initial
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontWeight: 900, fontSize: 16 }}>{user?.display_name || '놀자Go 사용자'}님</div>
            <div style={{ fontSize: 13, color: '#888' }}>{user?.location_name || '동네 인증 대기'}</div>
          </div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 14 }}>참여중인 놀이</div>
        <div
          style={{
            background: '#f36f72',
            color: 'white',
            padding: '12px 14px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          저녁 7시에 오리연못에서 경도 약속이 있어요.
        </div>
        <div style={{ fontWeight: 900, fontSize: 17, margin: '14px 0 10px' }}>최근 참여한 놀이</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {recent.map((item) => (
            <MockImage key={item} label={item} size={90} corner={10} />
          ))}
        </div>
        <div style={{ marginTop: 14, borderTop: '1px solid #ededed' }}>
          {[
            { label: '내 정보' },
            { label: '위시리스트', count: 6 },
            { label: '내가 참여한 놀이', count: 6 },
            { label: '로그아웃' },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                padding: '12px 4px',
                borderBottom: '1px solid #ededed',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 14,
              }}
            >
              <span style={{ width: 18 }}>{row.count ? '♡' : '👤'}</span>
              <span style={{ flex: 1 }}>{row.label}</span>
              {row.count ? <span style={{ color: '#d65c63', fontWeight: 800 }}>({row.count})</span> : null}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#b6b6b6', marginTop: 12 }}>
          ⓒ 2026 nolzaGo company. All rights reserved.
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfileScreen;
