# Testing record

Date: 25 October 2026. App: Next.js 16.4.3, React 19.3.0. Browser: headless Microsoft Edge through Playwright. Tested a production build served at `http://127.0.0.1:3003`, not only the development server. All results below were observed by the coding agent, not a human participant.

## Commands actually run

| Command                                              | Actual result                                                                                                         | Outcome                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `npm install`                                        | Installed 348 packages; npm reported zero vulnerabilities at that time.                                               | PASS                    |
| `npm run lint` (initial)                             | Flagged JSX constructed inside try/catch blocks. Moved successful rendering outside request-handling blocks.          | Initially failed, fixed |
| `npm run build` (initial)                            | TypeScript caught a state union that did not narrow the error variant. Split idle and loading into separate variants. | Initially failed, fixed |
| `npm run lint` (after fixes)                         | No diagnostics.                                                                                                       | PASS                    |
| `npm test`                                           | Shared HTTP checks, empty/invalid responses, network message distinction, real employee 1 and 10 real posts passed.   | PASS                    |
| `npm run build` (after fixes)                        | TypeScript and production compilation passed; `/` reported as dynamic, server-rendered on demand.                     | PASS                    |
| `npm run test:browser` with `BROWSER_CHANNEL=msedge` | Full browser suite passed; no page JavaScript errors.                                                                 | PASS                    |

## Required checks

| Check                | Expected result                                                             | Actual observation                                                                                                                                                                                         | Result |
| -------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Server profile       | Name, email, company from employee 1.                                       | Leanne Graham, Sincere@april.biz, Romaguera-Crona in the page; also independently verified the real endpoint in focused tests.                                                                             | PASS   |
| Server preview       | Focused fallback during two-second request-time delay; shell stays visible. | Fallback visible at 495ms, resolved at 2497ms. Main title and explorer heading stayed visible; three real titles then appeared.                                                                            | PASS   |
| Client idle          | No posts API request in browser before click.                               | Browser request listener saw zero JSONPlaceholder requests while profile and preview loaded.                                                                                                               | PASS   |
| Client slow          | Loading feedback, no duplicate request.                                     | Button and selector disabled, loading text visible; repeated Enter did not create more requests. One real request after delay; completion at 2570ms.                                                       | PASS   |
| Client success       | Real titles and bodies appear.                                              | Ten posts appeared after Slow and Success requests; body content and count checked.                                                                                                                        | PASS   |
| HTTP failure         | Shared checker throws custom error and Retry appears.                       | Local Response with 503 produced HTTP 503 message and Retry. Focused test verified `instanceof ApiError`, status, and message. No API request for this simulation.                                         | PASS   |
| Empty response       | Successful empty result is not an error.                                    | Local successful Response containing `[]` displayed No posts found, with no error panel or API request.                                                                                                    | PASS   |
| Recovery             | Change HTTP error to Success and retry.                                     | Real browser request returned ten posts; error panel cleared.                                                                                                                                              | PASS   |
| Section independence | Client failure does not remove server sections.                             | Real profile and three-title preview remained visible during HTTP error.                                                                                                                                   | PASS   |
| Usability            | Labelled controls, keyboard focus, readable around 360px.                   | Tab traversed skip link, email, selector, button; solid focus outline checked; Enter loaded posts. No horizontal overflow at 360px before or after success. Desktop/mobile screenshots visually inspected. | PASS   |

## Additional checks and limitations

- Network failure: browser test intercepted the posts request and aborted it. A connection-specific message appeared and Retry became available. This was a test simulation, not a live outage.
- Invalid JSON and invalid payload shape: shared parser rejected both in focused tests. Unexpected failures use a safe generic message.
- Profile-specific HTTP failure rendering: implemented via a local catch using the same tested checker, but not browser-verified. An extra test-only server-fetch replacement attempt was blocked by automatic approval review before it ran; no simulated profile-outage screenshot is claimed. The tool only reported blocked by policy.
- Preview-specific failure and timeout UI: implemented but not induced in browser testing.
- No comprehensive accessibility audit or screen-reader test was performed.
- Employee ID 2 was discussed as a prediction, not executed.
- No student-authored initial predictions or personal verification were received before implementation. See the preserved authorship disclosure in INTERVIEW.md.

## Timing method

The browser test navigated directly with `waitUntil: commit`, waited for the preview fallback to be visible, checked the shell headings, and then waited for preview content. Times use elapsed wall-clock milliseconds from navigation. The Slow measurement begins just before clicking. Request listeners separately counted browser API calls. These values are one recorded run and are not performance guarantees. Navigation, prefetching, network latency, and buffering can change what is observed.

## Running the tests again

```sh
npm ci
npm run lint
npm test
npm run build
npm run start -- --port 3003
```

In a second terminal, install Playwright Chromium if needed (`npx playwright install chromium`) and run `npm run test:browser`. Alternatively, PowerShell with installed Edge:

```powershell
$env:BROWSER_CHANNEL = 'msedge'
npm run test:browser
```

`BASE_URL` can point to another local port. The browser test overwrites the evidence images and JSON with its latest actual run. API success checks need Internet access and working JSONPlaceholder CORS.

## Evidence

- [Normal dashboard](evidence/normal.png)
- [Server-preview fallback](evidence/server-preview-loading.png)
- [Client loading](evidence/client-loading.png)
- [Real posts success](evidence/success.png)
- [Simulated client HTTP error](evidence/client-error.png)
- [Simulated empty response](evidence/empty.png)
- [360px dashboard](evidence/mobile.png)
- [360px successful posts](evidence/mobile-success.png)
- [Recorded browser timing and requests](evidence/browser-results.json)

Final source formatting was followed by another successful lint and production build. A targeted credential-pattern scan returned no matches, and git diff whitespace checks passed.

