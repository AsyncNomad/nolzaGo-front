import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { apiFetch } from '../api/client';
import ImagePreview from '../components/ImagePreview';
import MockImage from '../components/MockImage';

const ChatListScreen = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    apiFetch('/api/v1/posts/mine')
      .then((data) => {
        if (!mounted) return;
        setRooms(data || []);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setError('채팅방을 불러오지 못했어요.');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ paddingBottom: 80 }}>
      <div className="panel" style={{ paddingBottom: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#d84f55', marginBottom: 12 }}>마이 채팅</div>
        <div className="list-card" style={{ border: '1px solid #f1f1f1', borderRadius: 10 }}>
          {error ? (
            <div style={{ padding: 12, color: '#c75f63', fontWeight: 700, textAlign: 'center' }}>{error}</div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: 12, color: '#888', textAlign: 'center', fontWeight: 700 }}>
              아직 참여 중인 채팅이 없어요.
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="list-item"
                style={{ gridTemplateColumns: '68px 1fr', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate(`/chat-room/${room.id}`, { state: room })}
              >
                {room.image_url ? (
                  <ImagePreview url={room.image_url} size={64} corner={10} />
                ) : (
                  <MockImage label={room.title?.slice(0, 4) || '채팅'} size={64} corner={10} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{room.title}</div>
                  <div style={{ fontSize: 12, color: '#777', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="pill" style={{ borderColor: '#d0d0d0', color: '#555', background: '#f5f5f5' }}>
                      {room.status || '모집 중'}
                    </span>
                    <span>{room.location_name || '장소 미정'}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {room.last_message || '메시지가 없습니다.'}
                    </span>
                    {room.unread_count ? (
                      <span
                        style={{
                          background: '#e95e65',
                          color: 'white',
                          borderRadius: '999px',
                          padding: '2px 8px',
                          fontWeight: 800,
                          fontSize: 11,
                          minWidth: 22,
                          textAlign: 'center',
                        }}
                      >
                        {room.unread_count}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default ChatListScreen;
