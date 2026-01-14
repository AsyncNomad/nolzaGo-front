import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiFetch, getToken } from '../api/client';
import { BackIcon } from '../assets/icons';

const RoleHelperScreen = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(state || null);
  const [me, setMe] = useState(null);
  const [role, setRole] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [counts, setCounts] = useState({ police: '', thief: '' });
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const wsRef = useRef(null);
  const currentCount = Math.max(1, post?.participants_count || 1);
  const fetchAssignments = async () => {
    try {
      const res = await apiFetch(`/api/v1/posts/${id}/roles`);
      setAssignments(res || []);
    } catch (_) {
      /* ignore */
    }
  };

  const wsUrl = useMemo(() => {
    if (!role) return null;
    const base = window.location.origin.replace(/^http/, 'ws');
    return `${base}/api/v1/posts/${id}/roles/chat/ws?role=${role}&token=${getToken()}`;
  }, [id, role]);

  useEffect(() => {
    apiFetch(`/api/v1/posts/${id}`)
      .then((p) => setPost(p))
      .catch(() => {});
    apiFetch('/api/v1/auth/me')
      .then((u) => setMe(u))
      .catch(() => {});
    apiFetch(`/api/v1/posts/${id}/roles/me`)
      .then((res) => setRole(res?.role || null))
      .catch(() => setRole(null));
    fetchAssignments();
  }, [id]);

  useEffect(() => {
    if (!wsUrl) return;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload.type === 'history') {
            setMessages(
              (payload.messages || []).map((m) => ({
                user_id: m.userId,
                user_display_name: m.userDisplayName,
                user_profile_image_url: m.userProfileImageUrl,
                content: m.content,
                created_at: m.createdAt,
              })),
            );
          } else if (payload.type === 'system') {
            setMessages((prev) => [
              ...prev,
              { system: true, content: payload.content, created_at: payload.createdAt },
            ]);
            fetchAssignments();
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
      } catch (e) {
        console.error(e);
      }
    };
    return () => ws.close();
  }, [wsUrl]);

  const assign = async () => {
    try {
      if (!post) {
        setError('모집 인원 정보를 불러오는 중입니다.');
        return;
      }
      const policeNum = parseInt(counts.police, 10) || 0;
      const thiefNum = parseInt(counts.thief, 10) || 0;
      if (policeNum + thiefNum > currentCount) {
        setError('현재 인원수보다 더 많은 인원수를 입력했어요.');
        return;
      }
      const res = await apiFetch(`/api/v1/posts/${id}/roles/assign`, {
        method: 'POST',
        body: JSON.stringify({ police: policeNum, thief: thiefNum }),
      });
      setAssignments(res || []);
       // 배정 후 내 역할 재조회 및 채팅 초기화
      const my = await apiFetch(`/api/v1/posts/${id}/roles/me`);
      setRole(my?.role || null);
      setMessages([]);
      setError('');
    } catch (err) {
      setError(err?.message || '배정 실패');
    }
  };

  const send = () => {
    if (!input.trim()) return;
    wsRef.current?.send(input.trim());
    setInput('');
  };

  const myId = me?.id;
  const isOwner = me?.id && post?.owner_id && me.id === post.owner_id;
  const myRoleIsPolice = role === 'police';

  const policeList = assignments.filter((a) => a.role === 'police');
  const thiefList = assignments.filter((a) => a.role === 'thief');

  const toggleCapture = async (targetId, next) => {
    try {
      const res = await apiFetch(`/api/v1/posts/${id}/roles/capture`, {
        method: 'POST',
        body: JSON.stringify({ user_id: targetId, captured: next }),
      });
      setAssignments((prev) =>
        prev.map((a) => (a.user_id === targetId ? { ...a, is_captured: res.is_captured } : a)),
      );
      setError('');
    } catch (err) {
      setError(err?.message || '체크 실패');
    }
  };

  return (
    <div className="mobile-shell light-panel" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
          aria-label="뒤로가기"
        >
          <BackIcon color="#a5a5a5" />
        </button>
        <span style={{ fontSize: 13, color: '#a5a5a5', fontWeight: 700 }}>놀이 도우미</span>
      </div>

      {post && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{post.title}</div>
          <div style={{ fontSize: 13, color: '#555' }}>{post.location_name || '장소 미정'}</div>
        </div>
      )}

      {isOwner ? (
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>역할 배정 (작성자만)</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span>경찰</span>
              <input
                type="number"
                min={0}
                value={counts.police}
                onChange={(e) => setCounts((c) => ({ ...c, police: e.target.value }))}
                style={{ width: 60 }}
              />
            </label>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span>도둑</span>
              <input
                type="number"
                min={0}
                value={counts.thief}
                onChange={(e) => setCounts((c) => ({ ...c, thief: e.target.value }))}
                style={{ width: 60 }}
              />
            </label>
            <button
              onClick={assign}
              style={{ border: '1px solid #f36f72', background: '#f36f72', color: 'white', padding: '6px 10px', borderRadius: 8 }}
            >
              랜덤 배정
            </button>
          </div>
          {error && <div style={{ color: '#d33', fontSize: 12 }}>{error}</div>}
        </div>
      ) : null}

      {assignments.length > 0 && (
        <div style={{ padding: '0 16px 12px 16px' }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>배정 현황</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13, color: '#444' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #e5e5e5', padding: '6px 4px', width: 40 }}>#</th>
                  <th style={{ borderBottom: '1px solid #e5e5e5', padding: '6px 4px' }}>경찰</th>
                  <th style={{ borderBottom: '1px solid #e5e5e5', padding: '6px 4px' }}>도둑</th>
                  <th style={{ borderBottom: '1px solid #e5e5e5', padding: '6px 4px', whiteSpace: 'nowrap' }}>수감 여부</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.max(policeList.length, thiefList.length, 1) }).map((_, idx) => {
                  const police = policeList[idx];
                  const thief = thiefList[idx];
                  const capturedBadge = thief ? (
                    <span
                      style={{
                        fontSize: 11,
                        color: thief.is_captured ? '#d33' : '#24a148',
                        border: `1px solid ${thief.is_captured ? '#d33' : '#24a148'}`,
                        padding: '2px 6px',
                        borderRadius: 10,
                        display: 'inline-block',
                        minWidth: 50,
                        textAlign: 'center',
                      }}
                    >
                      {thief.is_captured ? '잡힘' : '활동 중'}
                    </span>
                  ) : (
                    <span style={{ color: '#aaa' }}>-</span>
                  );
                  return (
                    <tr key={idx}>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px 4px', textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px 4px', textAlign: 'center' }}>
                        {police ? police.user_display_name || police.user_id : <span style={{ color: '#aaa' }}>-</span>}
                      </td>
                      <td style={{ borderBottom: '1px solid #f0f0f0', padding: '6px 4px', textAlign: 'center' }}>
                        {thief ? thief.user_display_name || thief.user_id : <span style={{ color: '#aaa' }}>-</span>}
                      </td>
                      <td
                        style={{
                          borderBottom: '1px solid #f0f0f0',
                          padding: '6px 4px',
                          textAlign: 'center',
                        }}
                      >
                        {myRoleIsPolice && thief ? (
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                            <input
                              type="checkbox"
                              checked={!!thief.is_captured}
                              onChange={(e) => toggleCapture(thief.user_id, e.target.checked)}
                            />
                            {capturedBadge}
                          </label>
                        ) : (
                          capturedBadge
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {role ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#f36f72' }}>
            내 역할: {role === 'police' ? '경찰' : '도둑'}
          </div>
          <div
            style={{
              flex: 1,
              border: '1px solid #ededed',
              borderRadius: 12,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              overflowY: 'auto',
              minHeight: 220,
            }}
          >
            {messages.map((m, idx) => {
              const mine = myId && m.user_id === myId;
              const name = m.user_display_name || (mine ? '나' : '참여자');
              if (m.system) {
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ fontSize: 11, color: '#999' }}>{m.content}</div>
                  </div>
                );
              }
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    alignItems: mine ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {!mine && (
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
                        {m.user_profile_image_url ? (
                          <img
                            src={m.user_profile_image_url}
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
                            {name.slice(0, 1)}
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#777' }}>{name}</div>
                  </div>
                  <div
                    style={{
                      background: mine ? '#f36f72' : '#f5f5f5',
                      color: mine ? '#fff' : '#333',
                      padding: '10px 12px',
                      borderRadius: 12,
                      maxWidth: '80%',
                      boxShadow: mine ? '0 4px 10px rgba(0,0,0,0.08)' : '0 2px 6px rgba(0,0,0,0.05)',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 10,
                padding: '10px 12px',
              }}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button
              onClick={send}
              style={{
                border: 'none',
                background: '#f36f72',
                color: 'white',
                padding: '10px 12px',
                borderRadius: 10,
                fontWeight: 800,
              }}
            >
              보내기
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>
          아직 역할이 배정되지 않았습니다. 작성자가 역할을 배정하면 이곳에서 역할별 채팅이 가능합니다.
        </div>
      )}
    </div>
  );
};

export default RoleHelperScreen;
