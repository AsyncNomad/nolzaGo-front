import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';
import ImagePreview from '../components/ImagePreview';
import { HeartIcon, LocationIcon } from '../assets/icons';
import { apiFetch } from '../api/client';
import { loadWishlist, saveWishlist, isWishlisted } from '../api/wishlist';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('동네 인증 대기');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const user = await apiFetch('/api/v1/auth/me');
        if (!mounted) return;
        setLocationName(user?.location_name || '동네 인증 대기');
        const fetched = await apiFetch('/api/v1/posts');
        if (!mounted) return;
        setPosts(fetched || []);
        // 서버의 is_liked 정보를 기준으로 위시리스트 동기화
        const serverLiked = (fetched || []).filter((p) => p.is_liked);
        setWishlist(serverLiked);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError('게시글을 불러오지 못했습니다.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 90, position: 'relative' }}>
      <div style={{ padding: '18px 16px 8px', fontSize: 20, fontWeight: 900 }}>{locationName}</div>
      <div className="panel" style={{ paddingTop: 6 }}>
        {loading ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#888' }}>불러오는 중...</div>
        ) : error ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#c75f63', fontWeight: 700 }}>{error}</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#888' }}>아직 이 동네에 모집글이 없어요.</div>
        ) : (
          <div className="list-card">
            {posts.map((post) => (
              <div
                className="list-item"
                key={post.id || post.title}
                onClick={() => navigate(`/play/${encodeURIComponent(post.title)}`, { state: post })}
                style={{ cursor: 'pointer' }}
              >
                {post.image_url ? (
                  <ImagePreview url={post.image_url} size={72} corner={10} />
                ) : (
                  <MockImage label={post.title.slice(0, 4)} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, position: 'relative' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{post.title}</div>
                  <div className="item-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <LocationIcon size={14} color="#c75f63" />
                      {post.location_name}
                    </span>
                  </div>
                  <div
                    className="item-meta"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pill" style={{ borderColor: '#f36f72', color: '#f36f72' }}>
                        {Math.max(1, post.participants_count ?? 0)}/{post.max_participants ?? 0}
                      </span>
                      <span
                        className="pill"
                        style={{
                          borderColor: '#d0d0d0',
                          color: '#555',
                          background: '#f5f5f5',
                        }}
                      >
                        {post.status || '모집 중'}
                      </span>
                      <span>{post.start_time ? new Date(post.start_time).toLocaleDateString('ko-KR') : '오늘'}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!post.id) return;
                        const currentlyLiked = isWishlisted(post.id);
                        apiFetch(`/api/v1/posts/${post.id}/like`, { method: 'POST' })
                          .then((res) => {
                            setPosts((prev) =>
                              prev.map((p) => (p.id === post.id ? { ...p, like_count: res.like_count } : p)),
                            );
                        setWishlist((prev) => {
                          const filtered = prev.filter((p) => p.id !== post.id);
                          const next = res.is_liked ? [...filtered, { ...post, like_count: res.like_count }] : filtered;
                          saveWishlist(next);
                          return next;
                        });
                      })
                      .catch((err) => console.error(err));
                      }}
                      className="like-badge"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                    >
                      <HeartIcon size={18} color={isWishlisted(post.id) ? '#f36f72' : undefined} />
                      <span>{post.like_count ?? 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/create')}
        style={{
          position: 'fixed',
          right: 24,
          bottom: 90,
          width: 62,
          height: 62,
          borderRadius: '50%',
          border: 'none',
          background: '#f36f72',
          color: 'white',
          fontSize: 32,
          boxShadow: '0 12px 18px rgba(0,0,0,0.18)',
          cursor: 'pointer',
        }}
        aria-label="글쓰기"
      >
        +
      </button>

      <BottomNav />
    </div>
  );
};

export default HomeScreen;
