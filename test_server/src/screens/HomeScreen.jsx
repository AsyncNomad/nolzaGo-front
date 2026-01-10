import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';
import { LocationIcon } from '../assets/icons';

const posts = [
  {
    title: '경찰과 도둑 모집합니다~!!✨✨',
    location: '카이스트 스포츠컴플렉스 앞',
    day: '오늘',
    people: '48/50',
  },
  {
    title: '경도해요',
    location: '카이스트 오리연못 앞',
    day: '오늘',
    people: '28/30',
  },
  {
    title: '지탈하고싶어요.',
    location: '카이스트 정문 앞',
    day: '내일',
    people: '20/28',
  },
  {
    title: '좀비게임잼⚡',
    location: '까치집회',
    day: '오늘',
    people: '13/30',
  },
  {
    title: '무궁화꽃, 윷알뺑 할실 분~~',
    location: '남대전 동사무소 앞 공원',
    day: '내일',
    people: '58/60',
  },
];

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 90, position: 'relative' }}>
      <div style={{ padding: '18px 16px 8px', fontSize: 20, fontWeight: 900 }}>유성구 온천2동</div>
      <div className="panel" style={{ paddingTop: 6 }}>
        <div className="list-card">
          {posts.map((post) => (
            <div className="list-item" key={post.title}>
              <MockImage label={post.title.slice(0, 4)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{post.title}</div>
                <div className="item-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <LocationIcon size={14} color="#c75f63" />
                    {post.location}
                  </span>
                </div>
                <div className="item-meta">
                  <span className="pill" style={{ borderColor: '#f36f72', color: '#f36f72' }}>
                    {post.people}
                  </span>
                  <span>{post.day}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          fontSize: 28,
          boxShadow: '0 12px 18px rgba(0,0,0,0.18)',
          cursor: 'pointer',
        }}
        aria-label="글쓰기"
      >
        ✏️
      </button>

      <BottomNav />
    </div>
  );
};

export default HomeScreen;
