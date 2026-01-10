import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const PlayDetailScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const post = state || {
    title: decodeURIComponent(id || ''),
    location: '유성구 온천2동',
    day: '오늘',
    people: '8/15',
    likes: 0,
    desc: '참여자가 선택되지 않았습니다.',
  };

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
            <div style={{ fontSize: 13, color: '#6f6f6f', marginTop: 4 }}>{post.location}</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, color: '#f36f72', fontWeight: 800 }}>{post.people} 모집</div>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: '#4a4a4a' }}>
          <div style={{ marginBottom: 6 }}>- 일정: {post.day}</div>
          <div>- 장소: {post.location}</div>
        </div>
      </div>

      <div style={{ padding: '16px', flex: 1, background: 'white', color: '#2b2b2b' }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10 }}>놀이 안내</div>
        <div style={{ lineHeight: 1.5, fontSize: 13, color: '#4a4a4a' }}>
          {post.desc ||
            `- 규칙: 서로 존중하며 즐겁게!
- 난이도: 누구나 참여 가능
- 준비물: 편한 복장과 텐션`}
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
            background: 'white',
            color: '#f36f72',
            fontSize: 20,
            cursor: 'pointer',
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
