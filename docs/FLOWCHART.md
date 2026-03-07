# Shared Bookmark — Application Flowchart

## Full App Flow

```mermaid
flowchart TD
    A([User opens app]) --> B[populateUsers]
    B --> C[Render user dropdown\n users 1–5]
    C --> D{User selects\na user}

    D --> E[getData userId\nfrom localStorage]
    E --> F[sortReverseChronological\nbookmarks]
    F --> G[renderBookmarks\nto DOM]

    G --> H{User action?}

    H -->|Like| I[incrementLike\nbookmarks, id]
    I --> J[setData userId, bookmarks]
    J --> G

    H -->|Copy URL| K[navigator.clipboard\nwriteText url]

    H -->|Submit form| L[createBookmark\nurl, title, desc]
    L --> M[getData + push\n+ setData]
    M --> G

    H -->|Switch user| D
```

## Add Bookmark Flow (detail)

```mermaid
flowchart LR
    A([Form submit]) --> B[createBookmark url, title, desc]
    B --> C{Returns bookmark object}
    C --> D[id: UUID\ntitle: string\nurl: string\ndescription: string\ncreatedAt: ISO string\nlikes: 0]
    D --> E[getData userId]
    E --> F[push new bookmark]
    F --> G[setData userId, updated array]
    G --> H[renderBookmarks]
```

## Architecture Layers

```
+---------------------------+
|          UI Layer         |  index.html + script.js
|  render, events, DOM ops  |
+---------------------------+
            |
+---------------------------+
|       Logic Layer         |  bookmarks.js
|  createBookmark           |
|  sortReverseChronological |
|  incrementLike            |
+---------------------------+
            |
+---------------------------+
|      Storage Layer        |  storage.js
|  getData / setData        |
|  localStorage             |
+---------------------------+
```

## ASCII Fallback (no Mermaid)

```
[Open app]
    |
[populateUsers] --> dropdown (users 1-5)
    |
[Select user]
    |
[getData(userId)] <-- localStorage
    |
[sortReverseChronological]
    |
[renderBookmarks] --> DOM
    |
   / | \
  /  |  \
Like Copy  Add bookmark
 |    |        |
increment  clipboard  createBookmark
Like()              |
 |              getData + push + setData
setData()           |
 |             renderBookmarks
renderBookmarks
```
