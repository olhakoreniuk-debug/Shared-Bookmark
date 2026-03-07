import { test } from "node:test";
import assert from "node:assert/strict";
import { getUserIds } from "../storage.js";

test("getUserIds returns 5 users", () => {
  const users = getUserIds();
  assert.equal(users.length, 5);
});
