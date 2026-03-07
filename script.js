import { getUserIds, getData, setData } from "./storage.js";
import {
  createBookmark,
  sortReverseChronological,
  incrementLike,
} from "./bookmarks.js";

const userSelect = document.getElementById("userSelect");
const bookmarksSection = document.getElementById("bookmarks");
const form = document.getElementById("bookmarkForm");

let currentUser = null;

/* ---------------------------
   Populate dropdown dynamically
---------------------------- */
function populateUsers() {
  const users = getUserIds();
  users.forEach((id) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `User ${id}`;
    userSelect.appendChild(option);
  });
}

populateUsers();

/* ---------------------------
   Handle user selection
---------------------------- */
userSelect.addEventListener("change", () => {
  currentUser = userSelect.value;
  renderBookmarks();
});

/* ---------------------------
   Render bookmarks
---------------------------- */
function renderBookmarks() {
  bookmarksSection.innerHTML = "";

  if (!currentUser) return;

  const data = getData(currentUser) || [];
  const bookmarks = sortReverseChronological(data);

  if (bookmarks.length === 0) {
    bookmarksSection.innerHTML = "<p>No bookmarks for this user.</p>";
    return;
  }

  bookmarks.forEach((bookmark) => {
    const article = document.createElement("article");

    const h3 = document.createElement("h3");
    const a = document.createElement("a");
    a.href = bookmark.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = bookmark.title;
    h3.appendChild(a);

    const desc = document.createElement("p");
    desc.textContent = bookmark.description;

    const meta = document.createElement("p");
    const small = document.createElement("small");
    small.textContent = `Created: ${new Date(bookmark.createdAt).toLocaleString()}`;
    meta.appendChild(small);

    const copyBtn = document.createElement("button");
    copyBtn.dataset.copy = bookmark.url;
    copyBtn.textContent = "Copy URL";

    const likeBtn = document.createElement("button");
    likeBtn.dataset.like = bookmark.id;
    likeBtn.textContent = `❤️ ${bookmark.likes}`;

    article.append(h3, desc, meta, copyBtn, likeBtn);
    bookmarksSection.appendChild(article);
  });
}

/* ---------------------------
   Add new bookmark
---------------------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!currentUser) return;

  const formData = new FormData(form);

  const newBookmark = createBookmark(
    formData.get("url"),
    formData.get("title"),
    formData.get("description"),
  );

  const existing = getData(currentUser) || [];
  setData(currentUser, [...existing, newBookmark]);

  form.reset();
  renderBookmarks();
});

/* ---------------------------
   Copy + Like (event delegation)
---------------------------- */
bookmarksSection.addEventListener("click", (e) => {
  const copyUrl = e.target.dataset.copy;
  const likeId = e.target.dataset.like;

  if (copyUrl) {
    navigator.clipboard.writeText(copyUrl);
  }

  if (likeId) {
    const data = getData(currentUser) || [];
    const updated = incrementLike(data, likeId);
    setData(currentUser, updated);
    renderBookmarks();
  }
});
