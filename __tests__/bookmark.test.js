import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createBookmark,
  sortReverseChronological,
  incrementLike,
} from "../bookmarks.js";

test("sortReverseChronological sorts newest first", () => {
  const input = [
    { createdAt: "2022-01-01T00:00:00Z" },
    { createdAt: "2024-01-01T00:00:00Z" },
  ];

  const result = sortReverseChronological(input);

  assert.equal(result[0].createdAt, "2024-01-01T00:00:00Z");
});

test("createBookmark returns correct shape", () => {
  const bookmark = createBookmark("https://example.com", "Example", "A site");

  assert.equal(bookmark.url, "https://example.com");
  assert.equal(bookmark.title, "Example");
  assert.equal(bookmark.description, "A site");
  assert.equal(bookmark.likes, 0);
  assert.ok(bookmark.id, "should have an id");
  assert.ok(bookmark.createdAt, "should have a createdAt timestamp");
});

test("incrementLike increases likes for matching id", () => {
  const bookmarks = [
    { id: "abc", likes: 0 },
    { id: "xyz", likes: 2 },
  ];

  const result = incrementLike(bookmarks, "abc");

  assert.equal(result.find((b) => b.id === "abc").likes, 1);
  assert.equal(result.find((b) => b.id === "xyz").likes, 2);
});

test("incrementLike does not mutate original array", () => {
  const bookmarks = [{ id: "abc", likes: 0 }];

  incrementLike(bookmarks, "abc");

  assert.equal(bookmarks[0].likes, 0);
});
