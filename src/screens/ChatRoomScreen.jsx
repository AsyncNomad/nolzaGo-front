import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon, CameraIcon, SendIcon } from '../assets/icons';
import MockImage from '../components/MockImage';
import BottomNav from '../components/BottomNav';

const messages = [
  { from: 'me', text: '안녕하세요! 저 저질체력인데 배려좀 부탁드려요 ㅠ', time: '오후 3:59' },
  { from: 'other', text: '당연하죠!', time: '오후 4:02' },
  { from: 'other', text: '오늘 저녁 6시에 만날까요?', time: '오후 4:07' },
];

const ChatRoomScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell light-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
          aria-label="뒤로가기"
        >
          <BackIcon color="#a5a5a5" />
        </button>
        <span style={{ fontSize: 13, color: '#a5a5a5', fontWeight: 700 }}>채팅방(약속 만드는 중)</span>
      </div>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="list-card" style={{ borderRadius: 16, boxShadow: '0 6px 14px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <MockImage label="경찰 도둑" size={60} corner={12} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>경찰과 도둑 모집합니다~!!✨✨</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6e6e6e' }}>
                <span role="img" aria-label="heart">
                  ❤️
                </span>
                <span>오늘</span>
                <span>약속 만드는 중</span>
              </div>
              <div style={{ fontSize: 12, color: '#3c3c3c', lineHeight: 1.4 }}>
                - 밤 10시까지 진행, 중간에 집 가기 금지
                <br />
                - 끝나고 원하는 사람들만 맥주 마시러 가자 제안
                <br />
                - 강도 높게 진행, 저질체력 위해 배려 가능
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 80 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {msg.from === 'other' ? (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#f0f0f0',
                      border: '1px solid #e3e3e3',
                    }}
                  />
                  <div
                    style={{
                      background: '#f5f5f5',
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }}
                  >
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 11, color: '#b0b0b0' }}>{msg.time}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 11, color: '#b0b0b0' }}>{msg.time}</span>
                  <div
                    style={{
                      background: '#f36f72',
                      color: 'white',
                      padding: '10px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      maxWidth: 220,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="camera-bar">
        <CameraIcon />
        <input
          placeholder=""
          style={{
            width: '100%',
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            padding: '10px 12px',
            fontSize: 13,
            background: '#f8f8f8',
            outline: 'none',
          }}
        />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#f36f72',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <SendIcon color="white" size={18} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChatRoomScreen;
