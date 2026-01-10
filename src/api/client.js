// Reverse proxy 환경: 현재 도메인(https://nolzago.sbserver.store) + 상대 경로(/api/...) 조합으로 호출
// API_BASE는 도메인까지만 사용하고, apiFetch 호출 시 `/api/...`를 붙여 전달합니다.
const API_BASE =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')) ||
  window.location.origin.replace(/\/$/, '');

export const getToken = () => localStorage.getItem('auth_token') || '';
export const setToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}

export { API_BASE };
