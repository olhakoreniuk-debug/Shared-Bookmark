import { getUserIds, getData, setData } from "./storage.js";
import {
  createBookmark,
  sortReverseChronological,
  incrementLike,
} from "./bookmarks.js";

const userSelect = document.getElementById("userSelect");
const bookmarksSection = document.getElementById("bookmarks");
const status = document.getElementById("status");
const form = document.getElementById("bookmarkForm");

let currentUser = null;

/* ---------------------------
   Populate dropdown
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
  status.textContent = "";

  if (!currentUser) return;

  const data = getData(currentUser) || [];
  const bookmarks = sortReverseChronological(data);

  if (bookmarks.length === 0) {
    status.textContent = "No bookmarks for this user.";
    return;
  }

  bookmarks.forEach((bookmark) => {
    const article = document.createElement("article");
    article.className = "bookmark-card";

    const h3 = document.createElement("h3");
    const a = document.createElement("a");
    a.href = bookmark.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "bookmark-link";
    a.textContent = bookmark.title;
    h3.appendChild(a);

    const desc = document.createElement("p");
    desc.className = "bookmark-description";
    desc.textContent = bookmark.description;

    const meta = document.createElement("p");
    const small = document.createElement("small");
    const time = document.createElement("time");
    time.className = "bookmark-created-at";
    time.dateTime = bookmark.createdAt;
    time.textContent = new Date(bookmark.createdAt).toLocaleString();
    small.append("Added: ", time);
    meta.appendChild(small);

    const actions = document.createElement("div");
    actions.className = "actions";

    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.dataset.copy = bookmark.url;
    copyBtn.textContent = "Copy URL";

    const likeBtn = document.createElement("button");
    likeBtn.type = "button";
    likeBtn.dataset.like = bookmark.id;
    likeBtn.textContent = `❤️ ${bookmark.likes}`;

    actions.append(copyBtn, likeBtn);
    article.append(h3, desc, meta, actions);
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
    navigator.clipboard
      .writeText(copyUrl)
      .then(() => {
        const btn = e.target;
        const original = btn.textContent;
        btn.textContent = "Copied!";
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = original;
          btn.disabled = false;
        }, 1500);
      })
      .catch(() => {
        alert("Could not copy URL. Please copy it manually.");
      });
  }

  if (likeId) {
    const data = getData(currentUser) || [];
    const updated = incrementLike(data, likeId);
    setData(currentUser, updated);
    renderBookmarks();
  }
});
