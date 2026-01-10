import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationIcon } from '../assets/icons';
import BottomNav from '../components/BottomNav';

const LocationConfirmScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="mobile-shell light-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#a6a6a6', fontWeight: 700 }}>동네 인증 페이지</span>
      </div>
      <div className="map-panel" style={{ flex: 1, margin: '0 14px', borderRadius: 18 }}>
        <div className="map-placeholder">
          <div
            style={{
              position: 'absolute',
              top: '46%',
              left: '52%',
              transform: 'translate(-50%, -50%)',
              width: 54,
              height: 54,
              borderRadius: '50%',
              background: '#f36f72',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 10px 18px rgba(0,0,0,0.12)',
            }}
          >
            <LocationIcon size={22} color="white" />
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 16px 20px' }}>
        <div
          style={{
            background: '#f36f72',
            color: 'white',
            padding: '14px 12px',
            textAlign: 'center',
            borderRadius: 10,
            fontWeight: 800,
          }}
        >
          유성구 온천2동으로 설정할까요?
        </div>
        <button
          className="button"
          style={{
            marginTop: 10,
            background: 'black',
            color: 'white',
            width: '100%',
          }}
          onClick={() => navigate('/home')}
        >
          좋아요!
        </button>
      </div>
      <BottomNav />
    </div>
  );
};

export default LocationConfirmScreen;
