const KEY = 'wishlist_posts';

export const loadWishlist = () => {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveWishlist = (list) => {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save wishlist', e);
  }
};

export const isWishlisted = (postId) => loadWishlist().some((p) => p.id === postId);

export const toggleWishlist = (post) => {
  const list = loadWishlist();
  const idx = list.findIndex((p) => p.id === post.id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(post);
  }
  saveWishlist(list);
  return list;
};
