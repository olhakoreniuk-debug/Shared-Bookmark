function generateId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function createBookmark(url, title, description) {
  return {
    id: generateId(),
    url,
    title,
    description,
    createdAt: new Date().toISOString(),
    likes: 0,
  };
}

export function sortReverseChronological(bookmarks) {
  return [...bookmarks].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export function incrementLike(bookmarks, id) {
  return bookmarks.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b));
}
