import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';
import { apiFetch, setToken } from '../api/client';
import { loadWishlist, saveWishlist, isWishlisted } from '../api/wishlist';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [joined, setJoined] = useState([]);
  const [finishedCount, setFinishedCount] = useState(0);

  useEffect(() => {
    apiFetch('/api/v1/auth/me')
      .then((data) => setUser(data))
      .catch(() => setUser(null));
    setWishlist(loadWishlist());
    apiFetch('/api/v1/posts/mine')
      .then((data) => {
        const all = data || [];
        const finished = all.filter((p) => (p.status || '모집 중') === '종료').length;
        const active = all.filter((p) => (p.status || '모집 중') !== '종료');
        setFinishedCount(finished);
        setJoined(active);
      })
      .catch(() => {
        setFinishedCount(0);
        setJoined([]);
      });
  }, []);

  const initial = user?.display_name?.[0] || user?.email?.[0] || '?';
  const statusColors = {
    '모집 중': { text: '#24a148', border: '#24a148', bg: '#e7f6ed' },
    '모집 마감': { text: '#caa300', border: '#caa300', bg: '#fff4d6' },
    '놀이 진행 중': { text: '#e74c3c', border: '#e74c3c', bg: '#fde2df' },
    종료: { text: '#777', border: '#d0d0d0', bg: '#f5f5f5' },
  };
  const getStatusStyle = (status) => statusColors[status] || statusColors['모집 중'];

  return (
    <div
      className="mobile-shell light-panel"
      style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 110 }}
    >
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
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>참여중인 놀이</div>
        {joined.length === 0 ? (
          <div
            style={{
              background: '#f9f9f9',
              color: '#888',
              padding: '12px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            참여 중인 놀이가 없어요.
          </div>
        ) : (
          joined.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#fff5f5',
                border: '1px solid #f36f72',
                color: '#2b2b2b',
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 8,
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
                  background: item.image_url ? 'transparent' : '#f9f9f9',
                  overflow: 'hidden',
                  border: '1px solid #f36f72',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  color: '#f36f72',
                }}
              >
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  item.title?.slice(0, 2) || '놀이'
                )}
              </div>
                <div style={{ flex: 1 }}>
                  <div>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#777' }}>{item.location_name || '장소 미정'}</div>
                </div>
              <div
                style={{
                  fontSize: 12,
                  color: getStatusStyle(item.status || '모집 중').text,
                  border: `1px solid ${getStatusStyle(item.status || '모집 중').border}`,
                  background: getStatusStyle(item.status || '모집 중').bg,
                  borderRadius: 8,
                  padding: '4px 8px',
                  fontWeight: 700,
                }}
              >
                {item.status || '모집 중'}
              </div>
            </div>
          ))
        )}
        <div style={{ marginTop: 14, borderTop: '1px solid #ededed', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 18 }}>♥</span>
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
            { label: '내가 참여한 놀이', count: finishedCount, icon: '👤', action: 'joined' },
            { label: '로그아웃', action: 'logout', icon: '👤' },
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
                  : row.action === 'joined'
                  ? () => navigate('/joined')
                  : undefined
              }
            >
              <span style={{ width: 18 }}>{row.icon || '👤'}</span>
              <span style={{ flex: 1 }}>{row.label}</span>
              {typeof row.count === 'number' ? (
                <span style={{ color: '#d65c63', fontWeight: 800 }}>({row.count})</span>
              ) : null}
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
