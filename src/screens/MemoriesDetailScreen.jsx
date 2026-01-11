import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../api/client';

const MemoriesDetailScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [memory, setMemory] = useState(
    state || {
      id,
      title: '추억',
      content: '',
      image_url: null,
      location_name: null,
      owner: null,
      created_at: null,
    },
  );
  const [loading, setLoading] = useState(!state);

  useEffect(() => {
    let mounted = true;
    if (state || !id) return;
    const load = async () => {
      try {
        const data = await apiFetch(`/api/v1/memories/${id}`);
        if (!mounted) return;
        setMemory(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, state]);

  const createdText = memory.created_at
    ? new Date(memory.created_at).toLocaleDateString('ko-KR')
    : '날짜 미정';
  const authorName = memory.owner?.display_name || 'user';

  return (
    <div className="mobile-shell" style={{ background: 'white', color: '#2b2b2b', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: 260, background: '#f1f1f1' }}>
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
        {memory.image_url ? (
          <img
            src={memory.image_url}
            alt={memory.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #ffe1e1, #f66f72)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 900,
              fontSize: 22,
              color: 'white',
            }}
          >
            {memory.title?.slice(0, 6) || '추억'}
          </div>
        )}
      </div>

      <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid #ededed' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{memory.title || '추억 제목'}</div>
            <div style={{ fontSize: 13, color: '#6f6f6f', marginTop: 4 }}>
              {memory.location_name || '기록된 장소 없음'}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 12, color: '#888' }}>{createdText}</div>
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
            {authorName.slice(0, 1)}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{authorName}</div>
        </div>
        {loading ? (
          <div style={{ padding: 10, color: '#888' }}>불러오는 중...</div>
        ) : (
          <div style={{ lineHeight: 1.6, fontSize: 13, color: '#4a4a4a', whiteSpace: 'pre-line' }}>
            {memory.content || '추억 내용이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoriesDetailScreen;
