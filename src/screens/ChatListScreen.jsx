import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import MockImage from '../components/MockImage';

const chats = [
  {
    title: '경찰과 도둑 모집합니다~!!✨✨',
    last: '저희 몇 시에 만나나요?',
    unread: 8,
  },
  {
    title: '무궁화꽃~, 얼음땡 할실 분~~',
    last: '안녕하세요 저도 할래요!!',
    unread: 11,
  },
];

const ChatListScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 80 }}>
      <div className="panel" style={{ paddingBottom: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#d84f55', marginBottom: 12 }}>마이 채팅</div>
        <div className="list-card" style={{ border: '1px solid #f1f1f1', borderRadius: 10 }}>
          {chats.map((chat) => (
            <div
              key={chat.title}
              className="list-item"
              style={{ gridTemplateColumns: '68px 1fr', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/chat-room')}
            >
              <MockImage label={chat.title.slice(0, 4)} size={64} corner={10} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{chat.title}</div>
                <div style={{ fontSize: 13, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {chat.last}
                  <span
                    style={{
                      background: '#e95e65',
                      color: 'white',
                      borderRadius: '999px',
                      padding: '4px 8px',
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {chat.unread}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChatListScreen;
