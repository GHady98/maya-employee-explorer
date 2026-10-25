# Interview notes

## Initial predictions — recorded before implementation

Authorship: The following are agent-authored predictions, not the student's own reasoning. The student was asked for predictions before coding; no answer had arrived when this checkpoint was committed. Preserve this disclosure and add any actual student answer separately rather than pretending it was written earlier.

1. Employee profile request will execute on the Next.js server, because an async Server Component owns it. The independent preview request will also execute there. The explorer request will execute in the browser only after a click.
2. The title, introduction, client explorer, and independent profile section should remain visible while the preview fallback is shown. The profile may display its own loading fallback until ready.
3. A button-handler fetch will not automatically activate Suspense. Explicit client state must show loading.
4. HTTP 503 should resolve to a Response with ok=false. The application must check it and throw its own ApiError. A transport/network failure can reject fetch without an HTTP Response.

## Student initial predictions

Pending user response. Do not backdate an answer or replace the original predictions after testing.

## After testing

Pending implementation and actual verification.

## After testing — 25 October 2026

The initial predictions above are preserved. All four agent predictions matched the observed implementation behaviour. No student prediction was received before implementation. These explanations are agent-prepared study notes; review and rewrite them in your own words before submission.

### 1. Where each request executes, and the evidence

`app/employee-profile.tsx` fetches `/users/1` on the server. `app/recent-posts.tsx` fetches `/posts?userId=1` on the server. Neither module has a client directive or is imported by the Client Component. The browser test saw no requests to JSONPlaceholder while both server sections displayed real data. `app/post-explorer.tsx` starts the browser fetch inside its button handler. The browser request listener observed the posts URL only after an action; see `evidence/browser-results.json`. A browser test request listener is evidence analogous to the Network panel; it is not a screenshot of the DevTools panel.

### 2. Why the profile is server-side and the button is client-side

The profile is immediately useful on arrival and needs no interaction. Its independent server fetch can stream without adding browser state for that section. The full post list is optional, so a Client Component waits for the visitor's click and manages request state. Server fetching is not a claim that the data is private: this API contains public sample records.

### 3. What activates Suspense

The async preview suspends during rendering under its own boundary: `connection()`, the intentional delay, and the fetch all happen inside that child. The fallback replaces only the preview subtree while it waits. A fetch started later by a click handler does not suspend render automatically. The explorer explicitly switches among idle, loading, success, empty, and error states instead.

### 4. Moving the preview boundary around the dashboard

If a single boundary enclosed all dashboard content, a suspending descendant could replace that whole subtree with its fallback. The visitor could lose the profile and explorer while waiting for the preview. Separate boundaries preserve independent work and clearer loading feedback. `loading.tsx` creates a route-segment loading boundary; shared layouts above it can stay visible. We did not need it because manual boundaries give this dashboard finer control. Awaiting the preview at the top of the page before returning its boundary would delay the shell instead.

### 5. Custom error and super(message)

`ApiError` extends the built-in Error, retains an HTTP `status`, and sets its name. `super(message)` calls the parent constructor so ordinary Error message and stack behaviour are initialized. `readJson` checks `response.ok` and throws this class before parsing a failed HTTP response. Both server and browser handling reuse it. `failureMessage` can therefore explain HTTP 503 separately from connection problems without exposing raw diagnostic data.

### 6. HTTP, network, and empty results

HTTP 503 has a Response but `ok` is false; our shared checker throws. A network rejection may supply no Response and is handled separately, including timeouts. An empty array is valid successful JSON: it becomes No posts found rather than an error. HTTP error and Empty demo modes create local Response objects and enter the same checking/parsing path. They are not claims about what JSONPlaceholder returned. The browser-only network rejection was introduced by test interception, not a real API outage.

### 7. Changing employee ID to 2

`EMPLOYEE_ID` in `lib/api.ts` builds the profile and posts URLs used in all three sections. Setting it to 2 would load employee 2's profile and posts in both server preview and browser explorer. Update the profile's teaching labels (currently EMPLOYEE 01 and users / 1) and the ID-specific tests too. Post count and exact content might differ; the preview still shows at most three. This change was predicted, not executed in the submitted version, which consistently requests employee 1.

### 8. What was verified

The agent directly verified request origin, streaming timing, duplicate prevention, error recovery, empty state, keyboard operation, and 360px wrapping. These are not personal student observations. The student should rerun at least one scenario and record their own observation here before submission.

## Meaningful AI suggestion and verification

Suggestion: call `await connection()` inside the preview, before the two-second delay and below a focused Suspense boundary, so the delay remains observable on fresh production requests instead of only during prerendering.

Verification: checked the installed Next.js documentation and official reference, built the production app, started it with `next start`, and navigated directly in a fresh browser page. The fallback was visible at 495ms and preview content at 2497ms in the recorded run. The shell and explorer headings remained visible. Accepted based on those checks. A static screenshot alone would not prove the timing. These checks were carried out by the agent; the student's independent verification remains to be added.

## Sources consulted

- [Next.js connection](https://nextjs.org/docs/app/api-reference/functions/connection)
- [Next.js fetching data](https://nextjs.org/docs/app/getting-started/fetching-data)
- [React Suspense](https://react.dev/reference/react/Suspense)
- [MDN using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [JSONPlaceholder guide](https://jsonplaceholder.typicode.com/guide/)

## Student follow-up

Pending: review these notes, explain one decision in your own words, and predict a small change before trying it. Do not retroactively call a later answer an initial prediction. Recording a 2–4 minute walkthrough is optional.

