import React, { useEffect, useRef, useState } from 'react';
import BottomNav from '../components/BottomNav';
import { loadKakaoSdk } from '../utils/kakao';
import { apiFetch } from '../api/client';

const MapScreen = () => {
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [toastText, setToastText] = useState('주변을 불러오는 중입니다...');

  useEffect(() => {
    let map;
    let markers = [];
    let userMarker = null;

    const setupMap = async () => {
      try {
        const kakao = await loadKakaoSdk();
        await new Promise((resolve) => kakao.maps.load(resolve));

        if (!mapRef.current) return;

        const defaultCenter = new kakao.maps.LatLng(37.498095, 127.02761);
        map = new kakao.maps.Map(mapRef.current, {
          center: defaultCenter,
          level: 4,
        

        const placeMeMarker = (center) => {
          // Custom pin using overlay so it always renders (data URI might be blocked on some setups)
          const content = document.createElement('div');
          content.style.width = '32px';
          content.style.height = '42px';
          content.style.position = 'relative';
          content.style.transform = 'translate(-50%, -100%)';
          content.innerHTML = `
            <svg width="32" height="42" viewBox="0 0 34 42" style="position:absolute;left:0;top:0;">
              <path fill="#f36f72" d="M17 0C7.6 0 0 7.4 0 16.5 0 28 17 42 17 42s17-14 17-25.5C34 7.4 26.4 0 17 0z"/>
              <circle cx="17" cy="16" r="6" fill="#fff"/>
            </svg>`;
          const overlay = new kakao.maps.CustomOverlay({
            position: center,
            content,
            yAnchor: 1,
          });
          overlay.setMap(map);
          markers.push(overlay);
        };

        const applyPosts = (posts, center) => {
          markers.forEach((m) => m.setMap(null));
          markers = [];
          const validPosts = posts.filter((p) => p.latitude && p.longitude);
          if (validPosts.length === 0) {
            setToastText('아직 주변에 놀이팟이 없어요.');
            return;
          }
          validPosts.forEach((p) => {
            const pos = new kakao.maps.LatLng(p.latitude, p.longitude);
            const marker = new kakao.maps.Marker({ position: pos, map });
            markers.push(marker);
          });
          map.setCenter(center);
          setToastText(`주변에 ${validPosts.length}개의 놀이팟이 있어요!`);
        };

        let posts = [];
        try {
          posts = await apiFetch('/api/v1/posts');
        } catch (err) {
          console.error('posts load failed', err);
          posts = [];
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              const center = new kakao.maps.LatLng(latitude, longitude);
              map.setCenter(center);
              map.setLevel(4);
              placeMeMarker(center);
              userMarker = markers.pop() || userMarker; // keep user marker separately
              applyPosts(posts, center);
              if (userMarker) userMarker.setMap(map);
              setMapReady(true);
            },
            () => {
              placeMeMarker(defaultCenter);
              userMarker = markers.pop() || userMarker;
              applyPosts(posts, defaultCenter);
              setMapReady(true);
            },
            { enableHighAccuracy: true, timeout: 8000 },
          );
        } else {
          placeMeMarker(defaultCenter);
          userMarker = markers.pop() || userMarker;
          applyPosts(posts, defaultCenter);
          setMapReady(true);
        }
      } catch (err) {
        console.error('kakao map init failed', err);
        setToastText('지도를 불러오는 데 실패했습니다.');
        setMapReady(false);
      }
    };

    setupMap();

    return () => {
      if (map) {
        map = null;
      }
      markers = [];
      userMarker = null;
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ background: '#f7f7f7', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 12, color: '#a7a7a7', fontWeight: 700 }}>놀이팟 위치 확인 페이지</span>
      </div>
      <div className="map-panel" style={{ margin: '0 14px', borderRadius: 18, height: 440, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {!mapReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#999' }}>
            지도를 불러오고 있어요...
          </div>
        )}
      </div>
      <div className="toast" style={{ textAlign: 'center', fontSize: 14, marginTop: 10 }}>
        {toastText}
      </div>
      <BottomNav />
    </div>
  );
};

export default MapScreen;
