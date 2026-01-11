import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { isWishlisted, loadWishlist, saveWishlist } from '../api/wishlist';
import { apiFetch } from '../api/client';

const PlayDetailScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const post = state || {
    title: decodeURIComponent(id || ''),
    location_name: '유성구 온천2동',
    start_time: null,
    max_participants: 0,
    participants_count: 0,
    like_count: 0,
    status: '모집 중',
    description: '참여자가 선택되지 않았습니다.',
    owner: null,
  };

  const [wish, setWish] = React.useState(isWishlisted(post.id));
  const [likeCount, setLikeCount] = React.useState(post.like_count ?? 0);
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    apiFetch('/api/v1/auth/me')
      .then((me) => setCurrentUser(me))
      .catch(() => setCurrentUser(null));
  }, []);

  const startText = post.start_time
    ? new Date(post.start_time).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '일정 미정';
  const statusText = post.status || '모집 중';
  const peopleText = `${Math.max(1, post.participants_count ?? 0)}/${post.max_participants ?? 0}`;
  const locationText = post.location_name || post.location || '장소 미정';

  return (
    <div className="mobile-shell" style={{ background: 'white', color: '#2b2b2b', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 260, background: '#f9f9f9' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: 'rgba(0,0,0,0.08)',
            border: 'none',
            borderRadius: 999,
            padding: '8px 10px',
            color: '#2b2b2b',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            padding: '6px 10px',
            borderRadius: 12,
            background: 'rgba(0,0,0,0.45)',
            fontSize: 12,
          }}
        >
          1 / 4
        </div>
        {currentUser && currentUser.id === post.owner_id ? (
          <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 8 }}>
            <button
              style={{
                border: '1px solid rgba(0,0,0,0.2)',
                background: 'white',
                borderRadius: 10,
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
              onClick={() => navigate(`/edit/${post.id}`, { state: { post } })}
            >
              수정하기
            </button>
            <button
              style={{
                border: '1px solid #f36f72',
                background: '#f36f72',
                color: 'white',
                borderRadius: 10,
                padding: '6px 10px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
              onClick={() => {
                if (!window.confirm('정말 삭제할까요?')) return;
                apiFetch(`/api/v1/posts/${post.id}`, { method: 'DELETE' })
                  .then(() => {
                    alert('삭제되었습니다.');
                    navigate('/home', { replace: true });
                  })
                  .catch((err) => {
                    console.error(err);
                    alert('삭제에 실패했습니다.');
                  });
              }}
            >
              삭제하기
            </button>
          </div>
        ) : null}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #ffe1e1, #f66f72)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 900,
            fontSize: 22,
          }}
        >
          {post.title?.slice(0, 6) || '놀이팟'}
        </div>
      </div>

      <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid #ededed' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{post.title}</div>
            <div style={{ fontSize: 13, color: '#6f6f6f', marginTop: 4 }}>{locationText}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, color: '#f36f72', fontWeight: 800 }}>
            {peopleText} 모집<br />
            <span style={{ color: '#888', fontSize: 12 }}>{statusText}</span>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#4a4a4a' }}>
          <div style={{ marginBottom: 6 }}>- 일정: {startText}</div>
          <div>- 장소: {locationText}</div>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, background: 'white', color: '#2b2b2b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              background: '#f5f5f5',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              color: '#f36f72',
              fontSize: 18,
            }}
          >
            {post.owner?.profile_image_url ? (
              <img
                src={post.owner.profile_image_url}
                alt="프로필"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              (post.owner?.display_name || '게스트').slice(0, 1)
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{post.owner?.display_name || '게스트'}</div>
        </div>
        <div style={{ lineHeight: 1.5, fontSize: 13, color: '#4a4a4a', whiteSpace: 'pre-line' }}>
          {post.description || '모집 내용이 없습니다.'}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          padding: '12px 14px 18px',
          background: 'white',
          position: 'sticky',
          bottom: 0,
          borderTop: '1px solid #ededed',
        }}
      >
        <button
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            border: '1px solid #f36f72',
            background: wish ? '#f36f72' : 'white',
            color: wish ? 'white' : '#f36f72',
            fontSize: 20,
            cursor: 'pointer',
          }}
          onClick={() => {
            if (!post.id) return;
            apiFetch(`/api/v1/posts/${post.id}/like`, { method: 'POST' })
              .then((res) => {
                setLikeCount(res.like_count ?? likeCount);
                setWish(res.is_liked ?? false);
                const current = loadWishlist().filter((p) => p.id !== post.id);
                const next = res.is_liked ? [...current, { ...post, like_count: res.like_count }] : current;
                saveWishlist(next);
              })
              .catch((err) => console.error(err));
          }}
        >
          ♥
        </button>
        <button
          style={{
            flex: 1,
            padding: '14px 12px',
            borderRadius: 12,
            border: 'none',
            background: '#f36f72',
            color: 'white',
            fontWeight: 900,
            fontSize: 15,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/chat-room')}
        >
          참여하기
        </button>
      </div>
    </div>
  );
};

export default PlayDetailScreen;
