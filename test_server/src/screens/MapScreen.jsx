import React from 'react';
import { LocationIcon } from '../assets/icons';
import MockImage from '../components/MockImage';
import BottomNav from '../components/BottomNav';

const MapScreen = () => {
  return (
    <div className="mobile-shell light-panel" style={{ background: '#f7f7f7', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#a7a7a7', fontWeight: 700 }}>놀이팟 위치 확인 페이지</span>
      </div>
      <div className="map-panel" style={{ margin: '0 14px', borderRadius: 18 }}>
        <div className="map-placeholder">
          <div className="pin" style={{ top: '32%', left: '18%' }}>
            <MockImage label="놀이터" size={56} corner={12} />
          </div>
          <div className="pin" style={{ top: '26%', left: '62%' }}>
            <MockImage label="놀이터" size={64} corner={14} />
          </div>
          <div
            className="pin"
            style={{
              top: '62%',
              left: '62%',
              width: 56,
              height: 56,
              borderRadius: 16,
              background: '#f36f72',
              color: 'white',
              fontSize: 12,
            }}
          >
            <MockImage label="경찰 도둑" size={50} corner={12} />
          </div>
        </div>
        <div className="toast" style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}>
          주변에 2개의 놀이팟이 있네요!
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default MapScreen;
