import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackIcon, SendIcon } from '../assets/icons';
import { apiFetch, getToken } from '../api/client';
import aiLogo from '../assets/ailogo.png';

const statusColors = {
  '모집 중': { text: '#24a148', border: '#24a148', bg: '#e7f6ed' },
  '모집 마감': { text: '#caa300', border: '#caa300', bg: '#fff4d6' },
  '놀이 진행 중': { text: '#e74c3c', border: '#e74c3c', bg: '#fde2df' },
  종료: { text: '#777', border: '#d0d0d0', bg: '#f5f5f5' },
};
const getStatusStyle = (status) => statusColors[status] || statusColors['모집 중'];

const ChatRoomScreen = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { state } = useLocation();
  const [post, setPost] = useState(state || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const wsRef = useRef(null);
  const [me, setMe] = useState(null);
  const formatTime = (ts) =>
    ts
      ? new Date(
          typeof ts === 'string' ? ts : ts.toISOString ? ts.toISOString() : ts,
        ).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
          timeZone: 'Asia/Seoul',
        })
      : '';
  const formatDate = (ts) =>
    ts
      ? new Date(
          typeof ts === 'string' ? ts : ts.toISOString ? ts.toISOString() : ts,
        ).toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric',
          timeZone: 'Asia/Seoul',
        })
      : '일정 미정';

  const wsUrl = useMemo(() => {
    const base = window.location.origin.replace(/^http/, 'ws');
    return `${base}/api/v1/posts/${postId}/chat/ws?token=${getToken()}`;
  }, [postId]);

  useEffect(() => {
    let mounted = true;
    apiFetch('/api/v1/auth/me')
      .then((u) => setMe(u))
      .catch(() => setMe(null));

    if (!post && postId) {
      apiFetch(`/api/v1/posts/${postId}`)
        .then((data) => {
          if (mounted) setPost(data);
        })
        .catch(() => {});
    }
    apiFetch(`/api/v1/posts/${postId}/chat/messages`)
      .then((data) => {
        if (mounted) setMessages(data || []);
      })
      .catch(() => {});

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (evt) => {
      try {
        const payload = JSON.parse(evt.data);
        if (payload.type === 'history' && Array.isArray(payload.messages)) {
          setMessages(
            payload.messages.map((m) => ({
              user_id: m.userId,
              user_display_name: m.userDisplayName,
              user_profile_image_url: m.userProfileImageUrl,
              content: m.content,
              created_at: m.createdAt,
              system: m.system || m.type === 'system',
            })),
          );
        } else if (payload.type === 'system') {
          setMessages((prev) => [
            ...prev,
            {
              content: payload.content,
              created_at: payload.createdAt,
              system: true,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              user_id: payload.userId,
              user_display_name: payload.userDisplayName,
              user_profile_image_url: payload.userProfileImageUrl,
              content: payload.content,
              created_at: payload.createdAt,
            },
          ]);
        }
      } catch (_) {
        // ignore
      }
    };
    ws.onclose = () => {};
    return () => {
      mounted = false;
      ws.close();
    };
  }, [postId, wsUrl, post]);

  const sendMessage = () => {
    if (!input.trim()) return;
    wsRef.current?.send(input.trim());
    setInput('');
  };

  const fetchSummary = async () => {
    if (summaryLoading) return;
    setSummaryLoading(true);
    setSummaryText('');
    setSummaryOpen(true);
    try {
      const res = await apiFetch(`/api/v1/posts/${postId}/chat/summary`);
      setSummaryText(res?.summary || '요약을 가져오지 못했어요.');
    } catch (err) {
      setSummaryText('요약을 가져오지 못했어요.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const myId = me?.id;

  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="mobile-shell light-panel" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
          aria-label="뒤로가기"
        >
          <BackIcon color="#a5a5a5" />
        </button>
        <span style={{ fontSize: 13, color: '#a5a5a5', fontWeight: 700 }}>
          {post?.title || '채팅방'}
        </span>
      </div>
      {post ? (
        <div
          style={{
            padding: '0 16px',
            marginBottom: 8,
          }}
        >
          <div
            onClick={() => navigate(`/play/${encodeURIComponent(post.title)}`, { state: post })}
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 14,
              boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
              display: 'grid',
              gridTemplateColumns: '60px 1fr',
              gap: 12,
              alignItems: 'center',
              position: 'sticky',
              top: 12,
              zIndex: 3,
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 12,
                background: 'linear-gradient(135deg,#c6d5ff,#f7bfd8)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                color: '#404040',
                fontSize: 14,
              }}
            >
              {post.title?.slice(0, 4) || '놀이팟'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 900, fontSize: 14 }}>{post.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6e6e6e' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{formatDate(post.start_time)}</span>
                  <span
                    className="pill"
                    style={{
                      border: `1px solid ${getStatusStyle(post.status || '모집 중').border}`,
                      color: getStatusStyle(post.status || '모집 중').text,
                      background: getStatusStyle(post.status || '모집 중').bg,
                      borderRadius: 999,
                      padding: '2px 8px',
                      fontWeight: 800,
                    }}
                  >
                    {post.status || '모집 중'}
                  </span>
                </span>
              </div>
              {post.description ? (
                <div style={{ fontSize: 12, color: '#3c3c3c', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                  {post.description}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div
        ref={listRef}
        style={{
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 80, minHeight: 360 }}>
          {messages.map((msg, idx) => {
            const mine = myId && msg.user_id === myId;
            const timeText = formatTime(msg.created_at);
            const name = msg.user_display_name || (mine ? '나' : '참여자');
            if (msg.system) {
              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ fontSize: 11, color: '#999' }}>{msg.content}</div>
                </div>
              );
            }
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {mine ? (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: 11, color: '#b0b0b0' }}>{timeText}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      {/* 내 닉네임은 표시하지 않음 */}
                      <div
                        style={{
                          background: '#f36f72',
                          color: 'white',
                          padding: '10px 12px',
                          borderRadius: 12,
                          fontSize: 13,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          maxWidth: 260,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, justifyContent: 'flex-start' }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: '#f0f0f0',
                        border: '1px solid #e3e3e3',
                        overflow: 'hidden',
                      }}
                    >
                      {msg.user_profile_image_url ? (
                        <img
                          src={msg.user_profile_image_url}
                          alt="프로필"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#999',
                            fontWeight: 800,
                          }}
                        >
                          {(msg.user_display_name || '유저').slice(0, 1)}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#777' }}>{name}</div>
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: '10px 12px',
                          borderRadius: 10,
                          fontSize: 13,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                    <span style={{ fontSize: 11, color: '#b0b0b0' }}>{timeText}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="camera-bar"
        style={{
          padding: '10px 12px',
          gap: 10,
          position: 'sticky',
          bottom: 0,
          background: 'white',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <button
          onClick={fetchSummary}
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            border: '1px solid #e3e3e3',
            background: '#fafafa',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="AI 요약"
          disabled={summaryLoading}
        >
            <img src={aiLogo} alt="AI" style={{ width: 40, height: 40, objectFit: 'contain' }} />
        </button>
        <input
          placeholder=""
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          style={{
            flex: 1,
            borderRadius: 12,
            border: '1px solid #e0e0e0',
            padding: '12px 12px',
            fontSize: 13,
            background: '#f8f8f8',
            outline: 'none',
          }}
        />
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#f36f72',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
          }}
          onClick={sendMessage}
        >
          <SendIcon color="white" size={20} />
        </div>
      </div>

      {summaryOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 30,
            padding: 16,
          }}
          onClick={() => setSummaryOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 14,
              padding: 18,
              width: '100%',
              maxWidth: 420,
              boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>채팅 3줄 요약</div>
              <button
                onClick={() => setSummaryOpen(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: 16,
                  cursor: 'pointer',
                  color: '#888',
                }}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 14, color: '#444', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
              {summaryLoading ? '요약을 불러오는 중입니다...' : summaryText || '요약을 가져오지 못했어요.'}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatRoomScreen;
