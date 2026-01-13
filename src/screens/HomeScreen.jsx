import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';
import ImagePreview from '../components/ImagePreview';
import { HeartIcon, LocationIcon } from '../assets/icons';
import { apiFetch } from '../api/client';
import { loadWishlist, saveWishlist, isWishlisted } from '../api/wishlist';

const STATUS_OPTIONS = ['모집 중', '모집 마감', '놀이 진행 중', '종료'];
const statusColors = {
  '모집 중': { text: '#24a148', border: '#24a148', bg: '#e7f6ed' },
  '모집 마감': { text: '#caa300', border: '#caa300', bg: '#fff4d6' },
  '놀이 진행 중': { text: '#e74c3c', border: '#e74c3c', bg: '#fde2df' },
  종료: { text: '#777', border: '#d0d0d0', bg: '#f5f5f5' },
};

const getStatusStyle = (status) => statusColors[status] || statusColors['모집 중'];

const HomeScreen = () => {
  const navigate = useNavigate();
  const [locationName, setLocationName] = useState('동네 인증 대기');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(['모집 중']);
  const [search, setSearch] = useState('');

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

  const filteredPosts = React.useMemo(() => {
    const activeStatuses = selectedStatuses.length ? selectedStatuses : ['모집 중'];
    return (posts || [])
      .filter((post) => activeStatuses.includes(post.status || '모집 중'))
      .filter((post) => (post.title || '').toLowerCase().includes(search.trim().toLowerCase()));
  }, [posts, selectedStatuses, search]);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  };

  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 90, position: 'relative' }}>
      <div
        style={{
          padding: '18px 16px 8px',
          fontSize: 20,
          fontWeight: 900,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          gap: 12,
        }}
      >
        <span>{locationName}</span>
        <div style={{ flex: 1, maxWidth: 200 }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="모집글 제목 검색"
            style={{
              width: '100%',
              border: '1px solid #e0e0e0',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 600,
              color: '#444',
              outline: 'none',
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
            }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowFilter((prev) => !prev)}
            style={{
              border: '1px solid #e0e0e0',
              background: '#fff',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              color: '#444',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            }}
          >
            진행 상태 필터
          </button>
          {showFilter && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                marginTop: 8,
                background: '#fff',
                border: '1px solid #e7e7e7',
                borderRadius: 12,
                padding: 12,
                boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                minWidth: 200,
                zIndex: 20,
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 8 }}>진행 상태</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STATUS_OPTIONS.map((status) => (
                  <label
                    key={status}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="panel" style={{ paddingTop: 6 }}>
        {loading ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#888' }}>불러오는 중...</div>
        ) : error ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#c75f63', fontWeight: 700 }}>{error}</div>
        ) : posts.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#888' }}>아직 이 동네에 모집글이 없어요.</div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ padding: '20px 12px', textAlign: 'center', color: '#888' }}>
            선택한 상태의 모집글이 없어요.
          </div>
        ) : (
          <div className="list-card">
            {filteredPosts.map((post) => (
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
                          borderColor: getStatusStyle(post.status || '모집 중').border,
                          color: getStatusStyle(post.status || '모집 중').text,
                          background: getStatusStyle(post.status || '모집 중').bg,
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
