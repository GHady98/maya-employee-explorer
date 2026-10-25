import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_CHANNEL
    ? { channel: process.env.BROWSER_CHANNEL }
    : {}),
});
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const requests = [];
const errors = [];
const results = {};
page.on("request", (request) => {
  if (request.url().startsWith("https://jsonplaceholder.typicode.com/"))
    requests.push(request.url());
});
page.on("pageerror", (error) => errors.push(error.message));
const start = Date.now();
await page.goto(process.env.BASE_URL || "http://127.0.0.1:3003", {
  waitUntil: "commit",
});
await page.getByTestId("preview-loading").waitFor({ state: "visible" });
assert.ok(
  await page.getByRole("heading", { name: "People, in focus." }).isVisible(),
);
assert.ok(
  await page.getByRole("heading", { name: "Explore all posts" }).isVisible(),
);
results.previewFallbackVisibleMs = Date.now() - start;
await page.screenshot({
  path: "docs/evidence/server-preview-loading.png",
  fullPage: true,
  caret: "initial",
});
await page.getByTestId("preview-data").waitFor({ state: "visible" });
results.previewResolvedMs = Date.now() - start;
assert.ok(results.previewResolvedMs >= 2000);
await page.getByTestId("profile-data").waitFor({ state: "visible" });
assert.match(
  await page.getByTestId("profile-data").innerText(),
  /Leanne Graham/,
);
assert.match(
  await page.getByTestId("profile-data").innerText(),
  /Sincere@april.biz/,
);
assert.match(
  await page.getByTestId("profile-data").innerText(),
  /Romaguera-Crona/,
);
assert.equal(await page.getByTestId("preview-data").locator("li").count(), 3);
assert.equal(
  requests.length,
  0,
  "server API requests must not appear as browser API requests",
);
await page.screenshot({
  path: "docs/evidence/normal.png",
  fullPage: true,
  caret: "initial",
});
await page.getByLabel("Demo scenario").selectOption("slow");
const slowStart = Date.now();
await page.getByRole("button", { name: "Load posts", exact: true }).click();
assert.ok(
  await page.getByRole("button", { name: "Loading posts…" }).isDisabled(),
);
assert.ok(await page.getByLabel("Demo scenario").isDisabled());
assert.match(
  await page.locator(".request-status").innerText(),
  /Loading posts/,
);
assert.equal(
  requests.length,
  0,
  "slow demo must delay the real browser request",
);
await page.keyboard.press("Enter");
await page.keyboard.press("Enter");
await page.screenshot({
  path: "docs/evidence/client-loading.png",
  fullPage: true,
  caret: "initial",
});
await page.locator(".full-posts li").first().waitFor({ state: "visible" });
results.slowResolvedMs = Date.now() - slowStart;
assert.ok(results.slowResolvedMs >= 2000);
assert.equal(requests.length, 1);
assert.equal(await page.locator(".full-posts li").count(), 10);
assert.ok(
  (await page.locator(".full-posts li p").first().innerText()).length > 10,
);
await page.screenshot({
  path: "docs/evidence/success.png",
  fullPage: true,
  caret: "initial",
});
await page.getByLabel("Demo scenario").selectOption("http-error");
await page.getByRole("button", { name: "Load posts again" }).click();
await page
  .getByRole("button", { name: "Retry", exact: true })
  .waitFor({ state: "visible" });
assert.match(await page.locator(".explorer-result").innerText(), /HTTP 503/);
assert.equal(requests.length, 1, "local HTTP simulation must not call API");
assert.ok(await page.getByTestId("profile-data").isVisible());
assert.ok(await page.getByTestId("preview-data").isVisible());
await page.screenshot({
  path: "docs/evidence/client-error.png",
  fullPage: true,
  caret: "initial",
});
await page.getByLabel("Demo scenario").selectOption("success");
await page.getByRole("button", { name: "Retry", exact: true }).click();
await page.locator(".full-posts li").first().waitFor({ state: "visible" });
assert.equal(requests.length, 2);
assert.equal(await page.locator(".full-posts li").count(), 10);
assert.equal(await page.locator(".explorer .error-message").count(), 0);
await page.getByLabel("Demo scenario").selectOption("empty");
await page.getByRole("button", { name: "Load posts again" }).click();
await page.getByRole("heading", { name: "Explore all posts" }).waitFor();
await page
  .getByText("No posts found", { exact: true })
  .waitFor({ state: "visible" });
assert.equal(await page.locator(".explorer .error-message").count(), 0);
assert.equal(requests.length, 2);
await page.screenshot({
  path: "docs/evidence/empty.png",
  fullPage: true,
  caret: "initial",
});
await page.route(
  "https://jsonplaceholder.typicode.com/posts?userId=1",
  (route) => route.abort("internetdisconnected"),
);
await page.getByLabel("Demo scenario").selectOption("success");
await page.getByRole("button", { name: "Load posts again" }).click();
await page
  .getByRole("button", { name: "Retry", exact: true })
  .waitFor({ state: "visible" });
assert.match(
  await page.locator(".explorer-result").innerText(),
  /could not connect/,
);
results.networkFailure = "PASS (browser test interception, not a live outage)";
await page.unroute("https://jsonplaceholder.typicode.com/posts?userId=1");
await page.setViewportSize({ width: 360, height: 800 });
await page.reload({ waitUntil: "networkidle" });
await page.getByTestId("preview-data").waitFor();
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await page.screenshot({
  path: "docs/evidence/mobile.png",
  fullPage: true,
  caret: "initial",
});
await page.keyboard.press("Tab");
assert.equal(await page.locator(":focus").innerText(), "Skip to dashboard");
await page.keyboard.press("Tab");
assert.equal(
  await page.locator(":focus").getAttribute("href"),
  "mailto:Sincere@april.biz",
);
await page.keyboard.press("Tab");
assert.equal(await page.locator(":focus").getAttribute("id"), "scenario");
assert.equal(
  await page
    .locator(":focus")
    .evaluate((node) => getComputedStyle(node).outlineStyle),
  "solid",
);
await page.keyboard.press("Tab");
assert.equal(await page.locator(":focus").innerText(), "Load posts\n→");
await page.keyboard.press("Enter");
await page.locator(".full-posts li").first().waitFor();
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await page.screenshot({
  path: "docs/evidence/mobile-success.png",
  fullPage: true,
  caret: "initial",
});
assert.deepEqual(errors, []);
results.browserApiRequests = requests;
results.pageErrors = errors;
results.status =
  "PASS: shell streaming, live profile, no client fetch before click, slow single request, success, HTTP 503, recovery, empty, network failure, keyboard and 360px layout";
await writeFile(
  "docs/evidence/browser-results.json",
  JSON.stringify(results, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));
await browser.close();
