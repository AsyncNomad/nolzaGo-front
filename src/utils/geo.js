import { Geolocation } from '@capacitor/geolocation';

async function ensureLocationPermission() {
  try {
    const status = await Geolocation.checkPermissions();
    const granted = status.location === 'granted' || status.coarseLocation === 'granted';
    if (!granted) {
      await Geolocation.requestPermissions({ permissions: ['location'] });
    }
  } catch (_) {
    try {
      await Geolocation.requestPermissions({ permissions: ['location'] });
    } catch (__) {
      // ignore - fall back to browser prompt if available
    }
  }
}

export async function getCurrentPosition(options = {}) {
  const defaultOptions = { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 };
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    await ensureLocationPermission();
    return await Geolocation.getCurrentPosition(mergedOptions);
  } catch (err) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(err);
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, mergedOptions);
    });
  }
}
