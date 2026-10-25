import assert from "node:assert/strict";
import {
  ApiError,
  readJson,
  readPosts,
  readEmployee,
  failureMessage,
  PROFILE_URL,
  POSTS_URL,
} from "../lib/api.ts";
await assert.rejects(
  readPosts(new Response("unavailable", { status: 503 })),
  (error) =>
    error instanceof ApiError &&
    error.status === 503 &&
    error.message.includes("data service"),
);
assert.deepEqual(await readPosts(new Response("[]", { status: 200 })), []);
await assert.rejects(
  readPosts(new Response("{}", { status: 200 })),
  /Unexpected post data/,
);
await assert.rejects(
  readEmployee(new Response('{"id":1}', { status: 200 })),
  /Unexpected employee data/,
);
await assert.rejects(
  readJson(new Response("invalid JSON", { status: 200 })),
  SyntaxError,
);
assert.match(
  failureMessage(new ApiError("unavailable", 503), "Posts"),
  /HTTP 503/,
);
assert.match(
  failureMessage(new TypeError("Failed to fetch"), "Posts"),
  /could not connect/,
);
assert.match(
  failureMessage(new Error("bad data"), "Posts"),
  /could not be read/,
);
const profile = await readEmployee(
  await fetch(PROFILE_URL, { signal: AbortSignal.timeout(12000) }),
);
assert.equal(profile.id, 1);
assert.equal(profile.name, "Leanne Graham");
assert.equal(profile.email, "Sincere@april.biz");
assert.equal(profile.company.name, "Romaguera-Crona");
const posts = await readPosts(
  await fetch(POSTS_URL, { signal: AbortSignal.timeout(12000) }),
);
assert.equal(posts.length, 10);
assert.ok(posts.every((post) => post.userId === 1));
console.log(
  `PASS: shared 503/empty/invalid response handling, network distinction; live employee ${profile.id}, ${posts.length} real posts.`,
);
