import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../assets/icons';
import MockImage from '../components/MockImage';

const CreatePlayScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell light-panel" style={{ background: '#f7f7f7' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
          aria-label="뒤로가기"
        >
          <BackIcon color="#2f2f2f" />
        </button>
        <span style={{ fontSize: 14, color: '#b0b0b0', fontWeight: 700 }}>놀이 모집 등록 페이지</span>
      </div>
      <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="field-label" style={{ color: '#d56563' }}>
          제목
        </div>
        <input className="input muted-input" placeholder="" style={{ color: '#ca6b6b' }} />
        <div className="field-label">언제 놀까요?</div>
        <input className="input muted-input" placeholder="" />
        <div className="field-label">어디에서 놀까요?</div>
        <input className="input muted-input" value="유성구 온천2동" readOnly />
        <button className="button coral" style={{ width: 110 }}>
          위치 수정
        </button>
        <div className="field-label" style={{ color: '#d56563' }}>
          내용
        </div>
        <textarea
          className="input muted-input"
          style={{ height: 130, resize: 'none', borderRadius: 8, borderWidth: 1, color: '#ca6b6b' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 70,
              height: 70,
              border: '1px solid #e1e1e1',
              borderRadius: 8,
              display: 'grid',
              placeItems: 'center',
              color: '#f36f72',
              fontWeight: 900,
              fontSize: 24,
            }}
          >
            +
          </div>
          <MockImage label="자전거" size={70} corner={6} />
          <MockImage label="자전거" size={70} corner={6} />
        </div>
      </div>
    </div>
  );
};

export default CreatePlayScreen;
