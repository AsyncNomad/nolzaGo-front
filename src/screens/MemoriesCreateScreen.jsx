import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../assets/icons';
import MockImage from '../components/MockImage';

const mockPlays = [
  { title: '경찰과 도둑 모집합니다~!!✨✨', host: 'user1', imageLabel: '경찰' },
  { title: '경도해요', host: 'user2', imageLabel: '경도' },
  { title: '지탈하고싶어요.', host: 'user3', imageLabel: '지탈' },
  { title: '좀비게임잼⚡', host: 'user4', imageLabel: '좀비' },
];

const MemoriesCreateScreen = () => {
  const navigate = useNavigate();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState(mockPlays[0]);
  const plays = useMemo(() => mockPlays, []);

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
            <MockImage label={selectedPlay.imageLabel} size={64} corner={12} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{selectedPlay.title}</div>
              <div style={{ fontSize: 12, color: '#7d7d7d' }}>{selectedPlay.host}</div>
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
            />
            <label style={{ fontWeight: 800, color: '#d34e55', fontSize: 14 }}>내용</label>
            <textarea
              className="muted-input"
              placeholder="여기에 적어주세요!"
              rows={6}
              style={{ width: '100%', padding: 12, borderRadius: 10, resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                border: '2px dashed #e09395',
                display: 'grid',
                placeItems: 'center',
                color: '#e09395',
                fontSize: 30,
              }}
            >
              +
            </div>
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                background: '#f3f3f3',
                border: '1px solid #e6e6e6',
              }}
            />
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                background: '#f3f3f3',
                border: '1px solid #e6e6e6',
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 20px' }}>
        <button
          className="button coral"
          style={{ width: '100%', borderRadius: 10, padding: 14, fontSize: 16 }}
          onClick={() => {}}
        >
          추억 올리기
        </button>
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
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>추억 남길 놀이 선택</div>
            {plays.map((play) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoriesCreateScreen;
