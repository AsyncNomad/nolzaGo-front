let kakaoPromise = null;

export const loadKakaoSdk = () => {
  if (kakaoPromise) return kakaoPromise;
  kakaoPromise = new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }
    const script = document.createElement('script');
    script.id = 'kakao-map-sdk';
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => resolve(window.kakao);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return kakaoPromise;
};
