import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';
import { apiFetch, setToken } from '../api/client';
import { loadWishlist, saveWishlist, isWishlisted } from '../api/wishlist';

const recent = ['자전거', '하우스', '공구'];

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    apiFetch('/api/v1/auth/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null));
    setWishlist(loadWishlist());
  }, []);

  const initial = user?.display_name?.[0] || user?.email?.[0] || '?';

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
        <div style={{ marginTop: 14, borderTop: '1px solid #ededed', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 18 }}>♡</span>
            <span style={{ flex: 1, fontWeight: 700 }}>위시리스트</span>
            <span style={{ color: '#d65c63', fontWeight: 800 }}>({wishlist.length})</span>
          </div>
          {wishlist.length === 0 ? (
            <div style={{ padding: '8px 4px', color: '#888', fontSize: 13 }}>아직 담은 놀이가 없어요.</div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '10px 4px',
                  borderBottom: '1px solid #ededed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/play/${encodeURIComponent(item.title)}`, { state: item })}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: '#f9f9f9',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    color: '#f36f72',
                  }}
                >
                  {item.title?.slice(0, 2) || '놀이'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#777' }}>{item.location_name || '장소 미정'}</div>
                </div>
                <button
                  style={{
                    border: '1px solid #f36f72',
                    background: isWishlisted(item.id) ? '#f36f72' : 'white',
                    color: isWishlisted(item.id) ? 'white' : '#f36f72',
                    borderRadius: 10,
                    padding: '6px 10px',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!item.id) return;
                    apiFetch(`/api/v1/posts/${item.id}/like`, { method: 'POST' })
                      .catch((err) => console.error(err))
                      .finally(() => {
                        const next = loadWishlist().filter((p) => p.id !== item.id);
                        saveWishlist(next);
                        setWishlist(next);
                      });
                  }}
                >
                  ♥
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 12, borderTop: '1px solid #ededed' }}>
          {[
            { label: '내가 참여한 놀이', count: 6 },
            { label: '내 정보' },
            { label: '로그아웃', action: 'logout' },
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
                cursor: row.action ? 'pointer' : 'default',
              }}
              onClick={
                row.action === 'logout'
                  ? () => {
                      setToken('');
                      setUser(null);
                      navigate('/login', { replace: true });
                    }
                  : undefined
              }
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
