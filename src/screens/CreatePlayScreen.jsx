import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackIcon } from '../assets/icons';
import { apiFetch } from '../api/client';
import { loadKakaoSdk } from '../utils/kakao';

const minuteOptions = ['00', '10', '20', '30', '40', '50'];

const CreatePlayScreen = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('18');
  const [minute, setMinute] = useState('00');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(50);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [mapOpen, setMapOpen] = useState(false);
  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const kakaoRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    const today = new Date();
    setDate(today.toISOString().slice(0, 10));
  }, []);

  const canSubmit = useMemo(
    () => title && date && hour && minute && locationName && latitude && longitude && !saving,
    [title, date, hour, minute, locationName, latitude, longitude, saving],
  );

  const resetMarkers = () => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  };

  const openMap = async () => {
    setMapOpen(true);
    setError('');
    try {
      const kakao = await loadKakaoSdk();
      kakaoRef.current = kakao;
      await new Promise((resolve) => kakao.maps.load(resolve));
      if (!mapRef.current) return;
      const defaultCenter = new kakao.maps.LatLng(37.498095, 127.02761);
      const map = new kakao.maps.Map(mapRef.current, {
        center: defaultCenter,
        level: 4,
      });
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const center = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            map.setCenter(center);
            map.setLevel(4);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 8000 },
        );
      }
      mapRef.current._mapInstance = map;
      setMapReady(true);
    } catch (err) {
      console.error(err);
      setError('지도를 불러오지 못했습니다.');
    }
  };

  const handleSearch = () => {
    const kakao = kakaoRef.current;
    const map = mapRef.current?._mapInstance;
    const keyword = searchRef.current?.value?.trim();
    if (!kakao || !map || !keyword) return;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status !== kakao.maps.services.Status.OK) {
        setError('검색 결과가 없습니다.');
        return;
      }
      resetMarkers();
      const bounds = new kakao.maps.LatLngBounds();
      data.forEach((place) => {
        const pos = new kakao.maps.LatLng(place.y, place.x);
        const marker = new kakao.maps.Marker({ position: pos, map });
        markersRef.current.push(marker);
        bounds.extend(pos);
        kakao.maps.event.addListener(marker, 'click', () => {
          setLocationName(place.place_name);
          setLatitude(parseFloat(place.y));
          setLongitude(parseFloat(place.x));
          setMapOpen(false);
        });
      });
      map.setBounds(bounds);
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError('');
    try {
      // 로컬 시간을 tz정보 없는 문자열(YYYY-MM-DDTHH:MM:SS)로 맞춰 DB naive timestamp와 충돌을 피함
      const local = new Date(`${date}T${hour.padStart(2, '0')}:${minute}:00`);
      const startIso = new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
      await apiFetch('/api/v1/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          location_name: locationName,
          latitude,
          longitude,
          game_type: '모임',
          max_participants: maxParticipants,
          start_time: startIso,
        }),
      });
      alert('모집글이 등록되었어요.');
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('등록에 실패했습니다. 입력을 확인 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

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

      <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field-label" style={{ color: '#d56563' }}>
          제목
        </div>
        <input
          className="input muted-input"
          placeholder="제목을 입력해주세요."
          style={{ color: '#ca6b6b' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="field-label">언제 놀까요?</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            className="input muted-input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ flex: 1 }}
          />
          <select className="input muted-input" value={hour} onChange={(e) => setHour(e.target.value)} style={{ width: 90 }}>
            {Array.from({ length: 24 }).map((_, idx) => (
              <option key={idx} value={String(idx).padStart(2, '0')}>
                {String(idx).padStart(2, '0')}시
              </option>
            ))}
          </select>
          <select className="input muted-input" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ width: 90 }}>
            {minuteOptions.map((m) => (
              <option key={m} value={m}>
                {m}분
              </option>
            ))}
          </select>
        </div>

        <div className="field-label">어디에서 놀까요?</div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input className="input muted-input" value={locationName} readOnly placeholder="장소를 선택해주세요." />
          <button className="button coral" style={{ width: 110 }} onClick={openMap}>
            위치 수정
          </button>
        </div>

        <div className="field-label">몇 명이서 놀까요?</div>
        <input
          className="input muted-input"
          type="number"
          min={1}
          max={100}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
        />

        <div className="field-label" style={{ color: '#d56563' }}>
          내용
        </div>
        <textarea
          className="input muted-input"
          style={{ height: 130, resize: 'none', borderRadius: 8, borderWidth: 1, color: '#ca6b6b' }}
          placeholder="모집 내용을 입력해주세요."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error ? (
          <div style={{ color: '#c75f63', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{error}</div>
        ) : null}

        <button
          className="button coral"
          style={{ marginTop: 6, opacity: canSubmit ? 1 : 0.6 }}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {saving ? '등록 중...' : '등록하기'}
        </button>
      </div>

      {mapOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 999,
            padding: '0 14px',
          }}
          onClick={() => setMapOpen(false)}
        >
          <div
            style={{
              background: 'white',
              width: '100%',
              maxWidth: 480,
              borderRadius: 12,
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                ref={searchRef}
                className="input"
                placeholder="장소를 검색하세요."
                style={{ flex: 1, border: '1px solid #eee', color: '#ca6b6b' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <button className="button coral" style={{ width: 80 }} onClick={handleSearch}>
                검색
              </button>
            </div>
            <div style={{ height: 360, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              {!mapReady && (
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#999' }}>
                  지도를 불러오고 있어요...
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#777' }}>마커를 클릭하면 장소가 설정돼요.</div>
            <button className="button white" onClick={() => setMapOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePlayScreen;
