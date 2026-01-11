import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackIcon } from '../assets/icons';
import { apiFetch, getToken } from '../api/client';
import { loadKakaoSdk } from '../utils/kakao';
import ImagePreview from '../components/ImagePreview';

const minuteOptions = ['00', '10', '20', '30', '40', '50'];

const EditPlayScreen = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { state } = useLocation();

  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const kakaoRef = useRef(null);
  const markersRef = useRef([]);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('18');
  const [minute, setMinute] = useState('00');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [description, setDescription] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fillFromPost = (post) => {
      setTitle(post.title || '');
      if (post.start_time) {
        const d = new Date(post.start_time);
        setDate(d.toISOString().slice(0, 10));
        setHour(String(d.getHours()).padStart(2, '0'));
        setMinute(String(Math.floor(d.getMinutes() / 10) * 10).toString().padStart(2, '0'));
      }
      setLocationName(post.location_name || '');
      setLatitude(post.latitude || null);
      setLongitude(post.longitude || null);
      setDescription(post.description || '');
      setMaxParticipants(String(post.max_participants ?? ''));
      setImageUrl(post.image_url || '');
    };

    if (state?.post) {
      fillFromPost(state.post);
    } else {
      apiFetch(`/api/v1/posts/${postId}`)
        .then((post) => fillFromPost(post))
        .catch(() => {
          alert('모집글을 불러오지 못했습니다.');
          navigate(-1);
        });
    }
  }, [state, postId, navigate]);

  const maxValid =
    maxParticipants !== '' && Number.isInteger(Number(maxParticipants)) && Number(maxParticipants) >= 2 && Number(maxParticipants) <= 100;

  const canSubmit = useMemo(
    () =>
      title && date && hour && minute && locationName && latitude && longitude && maxValid && imageUrl && !saving,
    [title, date, hour, minute, locationName, latitude, longitude, maxValid, imageUrl, saving],
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
      const defaultCenter = new kakao.maps.LatLng(latitude || 37.498095, longitude || 127.02761);
      const map = new kakao.maps.Map(mapRef.current, {
        center: defaultCenter,
        level: 5,
      });
      mapRef.current._mapInstance = map;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const center = new kakao.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            map.setCenter(center);
            map.setLevel(5);
          },
          () => {},
          { enableHighAccuracy: true, timeout: 8000 },
        );
      }
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
      const local = new Date(`${date}T${hour.padStart(2, '0')}:${minute}:00`);
      const startIso = new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
      await apiFetch(`/api/v1/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          description,
          location_name: locationName,
          latitude,
          longitude,
          max_participants: Number(maxParticipants),
          start_time: startIso,
          image_url: imageUrl,
        }),
      });
      alert('수정되었습니다.');
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError('수정에 실패했습니다. 입력을 확인 후 다시 시도해주세요.');
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
        <span style={{ fontSize: 14, color: '#b0b0b0', fontWeight: 700 }}>놀이 모집 수정 페이지</span>
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
          min={2}
          max={100}
          value={maxParticipants}
          onChange={(e) => setMaxParticipants(e.target.value)}
          style={{ color: '#ca6b6b' }}
          placeholder="인원수는 2명부터 100명까지만 설정 가능해요."
        />
        {!maxValid && maxParticipants !== '' ? (
          <div style={{ color: '#f36f72', fontSize: 12 }}>인원수는 2명부터 100명까지만 설정 가능해요.</div>
        ) : null}

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

        <div className="field-label" style={{ color: '#d56563' }}>
          사진 업로드
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setSaving(true);
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
          <ImagePreview url={imageUrl} size={72} corner={10} />
        </div>

        {error ? (
          <div style={{ color: '#c75f63', fontWeight: 700, fontSize: 13, marginTop: 4 }}>{error}</div>
        ) : null}

        <button
          className="button coral"
          style={{ marginTop: 6, opacity: canSubmit ? 1 : 0.6 }}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {saving ? '수정 중...' : '수정하기'}
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

export default EditPlayScreen;
