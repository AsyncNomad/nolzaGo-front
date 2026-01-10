import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackIcon } from '../assets/icons';
import { loadKakaoSdk } from '../utils/kakao';
import { apiFetch, setToken } from '../api/client';

const LocationConfirmScreen = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const mapRef = useRef(null);
  const [locationName, setLocationName] = useState('동네를 찾는 중이에요...');
  const [rawLocation, setRawLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    let map;
    let marker;
    loadKakaoSdk()
      .then((kakao) => {
        kakao.maps.load(() => {
          if (!mapRef.current) return;
          const defaultPos = new kakao.maps.LatLng(37.498095, 127.02761);
          map = new kakao.maps.Map(mapRef.current, { center: defaultPos, level: 4 });
          marker = new kakao.maps.Marker({ position: defaultPos, map });
          setMapReady(true);

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                const locPosition = new kakao.maps.LatLng(latitude, longitude);
                map.setCenter(locPosition);
                map.setLevel(4);
                marker.setPosition(locPosition);

                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.coord2RegionCode(longitude, latitude, (result, status) => {
                  if (status === kakao.maps.services.Status.OK && result.length > 0) {
                    const region = result.find((r) => r.region_type === 'H') || result[0];
                    const locText = `${region.region_2depth_name} ${region.region_3depth_name}`;
                    setRawLocation(locText);
                    setLocationName(`${locText}으로 설정할게요.`);
                  } else {
                    setLocationName('동네 인식 실패');
                  }
                });
              },
              () => setLocationName('위치 권한을 허용해주세요.'),
              { enableHighAccuracy: true, timeout: 8000 },
            );
          } else {
            setLocationName('위치 정보를 지원하지 않는 브라우저입니다.');
          }
        });
      })
      .catch(() => setLocationName('지도를 불러오지 못했어요.'));

    return () => {
      map = null;
      marker = null;
    };
  }, []);

  return (
    <div className="mobile-shell light-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: 'none',
            background: 'transparent',
            padding: 4,
            cursor: 'pointer',
            marginRight: 4,
          }}
          aria-label="뒤로가기"
        >
          <BackIcon size={22} color="#2b2b2b" />
        </button>
        <span style={{ fontSize: 13, color: '#a6a6a6', fontWeight: 700 }}>동네 인증 페이지</span>
      </div>
      <div
        className="map-panel"
        style={{ flex: 1, margin: '0 14px', borderRadius: 18, position: 'relative', minHeight: 420 }}
      >
        <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: 420 }} />
        {!mapReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#999' }}>
            지도를 불러오고 있어요...
          </div>
        )}
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
          {locationName}
        </div>
        <button
          className="button"
          style={{
            marginTop: 10,
            background: 'black',
            color: 'white',
            width: '100%',
          }}
          disabled={signing || !state}
          onClick={async () => {
            setSigning(true);
            try {
              if (!rawLocation) {
                throw new Error('위치를 가져오지 못했습니다.');
              }
              const locationText = rawLocation || '동네 인증 대기';

              if (state?.signupType === 'kakao') {
                if (!state.kakaoToken) {
                  alert('카카오 로그인 정보가 없습니다. 다시 시도해주세요.');
                  navigate('/login');
                  return;
                }
                const data = await apiFetch('/api/v1/auth/kakao', {
                  method: 'POST',
                  body: JSON.stringify({
                    access_token: state.kakaoToken,
                    location_name: locationText,
                  }),
                });
                if (data?.access_token) {
                  setToken(data.access_token);
                  navigate('/home');
                } else {
                  throw new Error('카카오 로그인 완료 실패');
                }
              } else {
                if (!state?.email || !state?.password || !state?.passwordConfirm || !state?.nickname) {
                  alert('회원가입 정보가 없습니다. 다시 시도해주세요.');
                  navigate('/signup');
                  return;
                }
                await apiFetch('/api/v1/auth/signup', {
                  method: 'POST',
                  body: JSON.stringify({
                    email: state.email,
                    password: state.password,
                    password_confirm: state.passwordConfirm,
                    display_name: state.nickname || '놀자Go 사용자',
                    location_name: locationText,
                  }),
                });
                const body = new URLSearchParams();
                body.append('username', state.email);
                body.append('password', state.password);
                const res = await fetch('/api/v1/auth/token', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                  body,
                });
                if (!res.ok) throw new Error('로그인 실패');
                const data = await res.json();
                setToken(data.access_token);
                navigate('/home');
              }
            } catch (err) {
              console.error(err);
              alert('위치 인증 실패로 가입/로그인에 실패했습니다. 위치 권한을 허용한 뒤 다시 시도해주세요.');
              navigate(state?.signupType === 'kakao' ? '/login' : '/signup');
            } finally {
              setSigning(false);
            }
          }}
        >
          {signing ? '처리 중...' : '좋아요!'}
        </button>
      </div>
    </div>
  );
};

export default LocationConfirmScreen;
