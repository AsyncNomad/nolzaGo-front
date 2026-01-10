import React, { useEffect, useRef, useState } from 'react';
import BottomNav from '../components/BottomNav';

const loadKakaoMapScript = () =>
  new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }
    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    script.onload = () => resolve(window.kakao);
    script.onerror = reject;
    document.head.appendChild(script);
  });

const MapScreen = () => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let map;
    loadKakaoMapScript()
      .then((kakao) => {
        kakao.maps.load(() => {
          if (!mapRef.current) return;
          const center = new kakao.maps.LatLng(37.498095, 127.02761); // 강남역 근처 예시 좌표
          map = new kakao.maps.Map(mapRef.current, {
            center,
            level: 4,
          });
          const markerPositions = [
            center,
            new kakao.maps.LatLng(37.4975, 127.03),
            new kakao.maps.LatLng(37.499, 127.025),
          ];
          markerPositions.forEach((pos) => new kakao.maps.Marker({ position: pos, map }));
          setMapReady(true);
        });
      })
      .catch(() => setMapReady(false));

    return () => {
      if (map) {
        map = null;
      }
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ background: '#f7f7f7', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#a7a7a7', fontWeight: 700 }}>놀이팟 위치 확인 페이지</span>
      </div>
      <div className="map-panel" style={{ margin: '0 14px', borderRadius: 18, height: 440 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {!mapReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#999' }}>
            지도를 불러오고 있어요...
          </div>
        )}
      </div>
      <div className="toast" style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}>
        주변에 2개의 놀이팟이 있네요!
      </div>
      <BottomNav />
    </div>
  );
};

export default MapScreen;
