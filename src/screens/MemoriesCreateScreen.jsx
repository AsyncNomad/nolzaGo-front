import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../assets/icons';
import MockImage from '../components/MockImage';
import ImagePreview from '../components/ImagePreview';
import { apiFetch, getToken } from '../api/client';

const mockPlays = [];

const MemoriesCreateScreen = () => {
  const navigate = useNavigate();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState(null);
  const plays = useMemo(() => mockPlays, []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="mobile-shell light-panel" style={{ minHeight: '100vh', paddingBottom: 24 }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 5,
          padding: '14px 14px 10px',
          borderBottom: '1px solid #ededed',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            left: 12,
            top: 12,
            border: 'none',
            background: 'transparent',
            padding: 6,
            cursor: 'pointer',
          }}
          aria-label="뒤로가기"
        >
          <BackIcon size={22} color="#2b2b2b" />
        </button>
        <div style={{ fontWeight: 800, fontSize: 18 }}>추억 남기기</div>
      </div>

      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#d34e55' }}>추억 남길 놀이</div>
          <button
            onClick={() => setSelectorOpen(true)}
            style={{
              border: '1px solid #ededed',
              borderRadius: 12,
              padding: '10px 12px',
              display: 'grid',
              gridTemplateColumns: '70px 1fr 28px',
              gap: 10,
              alignItems: 'center',
              background: 'white',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {selectedPlay ? (
              <MockImage label={selectedPlay.title.slice(0, 4)} size={64} corner={12} />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  border: '1px dashed #d34e55',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#d34e55',
                  fontWeight: 800,
                }}
              >
                선택 안 함
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{selectedPlay ? selectedPlay.title : '선택하지 않아도 돼요'}</div>
              <div style={{ fontSize: 12, color: '#7d7d7d' }}>{selectedPlay ? selectedPlay.host : '참여 내역이 없어도 작성 가능'}</div>
            </div>
            <span style={{ justifySelf: 'end', color: '#d34e55', fontWeight: 800 }}>+</span>
          </button>
        </div>

        <div style={{ padding: '4px 2px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.4 }}>
            어떤 점이 좋고, 어떤 점이 별로였나요?
            <br />
            후기를 적어주세요!
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontWeight: 800, color: '#d34e55', fontSize: 14 }}>제목</label>
            <input
              className="muted-input"
              placeholder="제목을 입력하세요"
              style={{ width: '100%', padding: 12, borderRadius: 8 }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label style={{ fontWeight: 800, color: '#d34e55', fontSize: 14 }}>내용</label>
            <textarea
              className="muted-input"
              placeholder="여기에 적어주세요!"
              rows={6}
              style={{ width: '100%', padding: 12, borderRadius: 10, resize: 'none' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <label
              style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                border: '2px dashed #e09395',
                display: 'grid',
                placeItems: 'center',
                color: '#e09395',
                fontSize: 30,
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setSaving(true);
                  setError('');
                  try {
                    const form = new FormData();
                    form.append('file', file);
                    const res = await fetch('/api/v1/uploads/image', {
                      method: 'POST',
                      body: form,
                      headers: {
                        Authorization: getToken() ? `Bearer ${getToken()}` : undefined,
                      },
                    });
                    if (!res.ok) throw new Error('업로드 실패');
                    const data = await res.json();
                    setImageUrl(data.url);
                  } catch (err) {
                    console.error(err);
                    alert('이미지 업로드에 실패했습니다.');
                  } finally {
                    setSaving(false);
                  }
                }}
              />
              +
            </label>
            {imageUrl ? (
              <ImagePreview url={imageUrl} size={90} corner={12} />
            ) : (
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 12,
                  background: '#f3f3f3',
                  border: '1px solid #e6e6e6',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#b3b3b3',
                  fontWeight: 700,
                }}
              >
                preview
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 20px' }}>
        <button
          className="button coral"
          style={{ width: '100%', borderRadius: 10, padding: 14, fontSize: 16 }}
          disabled={!title || saving}
          onClick={async () => {
            if (!title) {
              setError('제목을 입력하세요.');
              return;
            }
            setSaving(true);
            setError('');
            try {
              await apiFetch('/api/v1/memories', {
                method: 'POST',
                body: JSON.stringify({
                  title,
                  content,
                  image_url: imageUrl || null,
                  location_name: selectedPlay ? selectedPlay.title : null,
                }),
              });
              alert('추억이 등록되었어요.');
              navigate('/memories');
            } catch (err) {
              console.error(err);
              setError('등록에 실패했습니다. 다시 시도해주세요.');
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? '올리는 중...' : '추억 올리기'}
        </button>
        {error && (
          <div style={{ marginTop: 8, color: '#c75f63', fontWeight: 700, textAlign: 'center' }}>{error}</div>
        )}
      </div>

      {selectorOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 20,
          }}
          onClick={() => setSelectorOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxHeight: '70vh',
              background: '#fff',
              borderTopLeftRadius: 14,
              borderTopRightRadius: 14,
              padding: '12px 14px',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>추억 남길 놀이 선택 (선택 안 해도 돼요)</div>
            {plays.length === 0 ? (
              <div style={{ padding: 12, color: '#777' }}>선택 가능한 놀이가 없습니다. 건너뛰어도 돼요.</div>
            ) : (
              plays.map((play) => (
                <button
                  key={play.title}
                  onClick={() => {
                    setSelectedPlay(play);
                    setSelectorOpen(false);
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    padding: '10px 6px',
                    display: 'grid',
                    gridTemplateColumns: '70px 1fr',
                    gap: 12,
                    alignItems: 'center',
                    borderBottom: '1px solid #f1f1f1',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <MockImage label={play.imageLabel} size={64} corner={12} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{play.title}</div>
                    <div style={{ fontSize: 12, color: '#7d7d7d' }}>{play.host}</div>
                  </div>
                </button>
              ))
            )}
            <button
              onClick={() => {
                setSelectedPlay(null);
                setSelectorOpen(false);
              }}
              style={{
                width: '100%',
                marginTop: 8,
                padding: 12,
                border: '1px solid #e5e5e5',
                borderRadius: 10,
                background: '#fafafa',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              선택 안 하고 넘어가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoriesCreateScreen;
