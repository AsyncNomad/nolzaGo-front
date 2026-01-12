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
    let postMarkers = [];
    let postLabels = [];
    let userMarker = null;
    let userLabel = null;
    const clearPostMarkers = () => {
      postMarkers.forEach((m) => m.setMap(null));
      postLabels.forEach((l) => l.setMap(null));
      postMarkers = [];
      postLabels = [];
    };

    const setupMap = async () => {
      try {
        const kakao = await loadKakaoSdk();
        await new Promise((resolve) => kakao.maps.load(resolve));

        if (!mapRef.current) return;

        const defaultCenter = new kakao.maps.LatLng(37.498095, 127.02761);
        const MAP_LEVEL = 6; // 더 넓은 반경(약 1cm=250m 수준)으로 고정
        map = new kakao.maps.Map(mapRef.current, {
          center: defaultCenter,
          level: MAP_LEVEL,
        });

        const placeMeMarker = (center) => {
          const image = new kakao.maps.MarkerImage(
            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 34 42"><path fill="%23f36f72" d="M17 0C7.6 0 0 7.4 0 16.5 0 28 17 42 17 42s17-14 17-25.5C34 7.4 26.4 0 17 0z"/><circle cx="17" cy="16" r="6" fill="%23fff"/></svg>',
            new kakao.maps.Size(32, 42),
            { offset: new kakao.maps.Point(16, 42) },
          );
          if (userMarker) userMarker.setMap(null);
          if (userLabel) userLabel.setMap(null);
          userMarker = new kakao.maps.Marker({ position: center, map, image });
          userLabel = new kakao.maps.CustomOverlay({
            position: center,
            yAnchor: 1.4,
            content:
              '<div style="background:#fff;padding:4px 8px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.15);font-size:11px;font-weight:800;color:#f36f72;white-space:nowrap;">나의 위치</div>',
          });
          userLabel.setMap(map);
        };

        const createPostMarker = (post) => {
          const pos = new kakao.maps.LatLng(post.latitude, post.longitude);
          const marker = new kakao.maps.Marker({
            position: pos,
            map,
            image: new kakao.maps.MarkerImage(
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 34 42"><path fill="%231e70ff" d="M17 0C7.6 0 0 7.4 0 16.5 0 28 17 42 17 42s17-14 17-25.5C34 7.4 26.4 0 17 0z"/><circle cx="17" cy="16" r="6" fill="%23fff"/></svg>',
              new kakao.maps.Size(30, 40),
              { offset: new kakao.maps.Point(15, 40) },
            ),
          });
          const label = new kakao.maps.CustomOverlay({
            position: pos,
            yAnchor: 1.3,
            content: `<div style="background:#fff;padding:4px 8px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.15);font-size:11px;font-weight:700;color:#1e70ff;white-space:nowrap;">${post.title || '놀이팟'}</div>`,
          });
          marker.setMap(map);
          label.setMap(map);
          postMarkers.push(marker);
          postLabels.push(label);
        };

        const applyPosts = (posts, center) => {
          clearPostMarkers();
          const validPosts = posts.filter((p) => p.latitude && p.longitude && (p.status === '모집 중'));
          if (validPosts.length === 0) {
            setToastText('아직 주변에 모집 중인 놀이팟이 없어요.');
            return;
          }
          validPosts.forEach((p) => createPostMarker(p));
          map.setCenter(center);
          setToastText(`주변에 ${validPosts.length}개의 놀이팟이 모집 중이에요!`);
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
              map.setLevel(MAP_LEVEL);
              placeMeMarker(center);
              applyPosts(posts, center);
              setMapReady(true);
            },
            () => {
              placeMeMarker(defaultCenter);
              applyPosts(posts, defaultCenter);
              setMapReady(true);
            },
            { enableHighAccuracy: true, timeout: 8000 },
          );
        } else {
          placeMeMarker(defaultCenter);
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
      clearPostMarkers();
      userMarker = null;
      userLabel = null;
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ background: '#f7f7f7', display: 'flex', flexDirection: 'column' }}>
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
