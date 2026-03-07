# Shared Bookmark — Project Presentation

## What is it?

A lightweight, browser-based bookmark manager that lets multiple users save, view, and interact with shared links — no backend required.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| UI | HTML5 (semantic), CSS |
| Logic | Vanilla JavaScript (ES Modules) |
| Persistence | `localStorage` (browser) |
| Tests | Node.js built-in test runner (`node:test`, `node:assert`) |

No frameworks. No build step. Open `index.html` in a browser and it works.

---

## Architecture

The app is split into three clear layers:

```
index.html / script.js     — UI & events
bookmarks.js               — Pure business logic (no DOM, no storage)
storage.js                 — localStorage read/write
```

This separation makes each layer independently testable. `bookmarks.js` functions are pure — given the same input, they always return the same output.

---

## Features (Current MVP)

- Select a user (1–5) from a dropdown
- View that user's bookmarks sorted newest-first
- Each bookmark shows: title (link), description, timestamp, like count
- Like a bookmark (count persists across sessions)
- Copy a bookmark URL to clipboard
- Add a new bookmark via form (URL, title, description)
- "No bookmarks yet" message for empty users

---

## How the Code is Organized

### `bookmarks.js` — Pure functions

| Function | What it does |
|----------|-------------|
| `createBookmark(url, title, desc)` | Returns a new bookmark object with UUID, timestamp, 0 likes |
| `sortReverseChronological(bookmarks)` | Returns a new array sorted newest-first |
| `incrementLike(bookmarks, id)` | Returns a new array with one bookmark's likes incremented |

### `storage.js` — localStorage helpers

| Function | What it does |
|----------|-------------|
| `getUserIds()` | Returns `["1","2","3","4","5"]` |
| `getData(userId)` | Reads and parses bookmarks from localStorage |
| `setData(userId, data)` | Serializes and saves bookmarks to localStorage |

### `script.js` — DOM & events

- `populateUsers()` — fills the user dropdown
- `renderBookmarks()` — builds bookmark HTML and injects into DOM
- Event listeners: user select, form submit, like button, copy button

---

## Team Workflow: MVP + Test-Driven Development

We develop one small function at a time, always starting with a test.

### Commit pattern per feature

```
1.  test: <describe expected behavior>    # write a failing test
2.  feat: <implement the function>        # minimal code to pass the test
3.  fix:  <correct edge case if needed>   # only if test still fails
4.  docs: <update docs if needed>
```

### Branch strategy

```
main                  <- stable, merged via PR only
  |
  feature/<fn-name>   <- one branch per function/feature
```

Each PR is small and focused on one function. A second team member reviews before merging.

### Example cycle

```
Branch: feature/increment-like

  commit 1 — test: incrementLike increases likes for matching id
  commit 2 — feat: implement incrementLike in bookmarks.js
  commit 3 — (PR opened, reviewed, merged to main)
```

---

## Running Tests

```bash
npm test
```

Tests use Node's built-in runner — no install needed.

---

## Running the App

Open `index.html` directly in a browser. No server required.
