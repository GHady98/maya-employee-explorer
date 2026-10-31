# Employee Explorer — Yehia Meets Maya

TECHTALKS · Assignment 03

Author: **Ghady Nazha** · GitHub: **GHady98**.

A fresh, standalone Next.js App Router project with one dashboard at `/`. It loads a sample employee profile on the server, streams an independent three-title post preview, and lets the visitor load complete posts in the browser after a click.

## Stack and setup

Next.js **16.4.3**, React **19.3.0**, TypeScript, plain CSS, native fetch, React state, Suspense, and a small custom ApiError. Use Node.js 22.18+ or Node.js 24, plus npm. No account, API key, backend, proxy, or database is needed.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production preview:

```sh
npm run build
npm run start -- --port 3003
```

## What runs where

- `app/employee-profile.tsx`: async Server Component fetches employee 1, showing name, email, and company. A local failure message preserves the rest of the page.
- `app/recent-posts.tsx`: independent async Server Component fetches the same employee's posts and shows up to three titles under a manual Suspense boundary.
- `app/post-explorer.tsx`: Client Component performs no fetch until Load posts or Retry. Explicit state represents idle, loading, success, empty, and error. A disabled button and synchronous in-flight guard prevent duplicate loads.
- `lib/api.ts`: employee ID/URLs, custom ApiError, common response.ok/JSON checking, minimal payload validation, and safe error messages. No server module is imported by the client.

Real endpoints are `https://jsonplaceholder.typicode.com/users/1` and `https://jsonplaceholder.typicode.com/posts?userId=1`. These are public sample users/posts, called employees only for the fictional interview.

## Intentional learning simulations

The server preview always calls `connection()` then waits **two seconds** before its real fetch. This happens at request time, including a fresh production reload. Its focused fallback leaves the shell and other sections available. The profile has its own Suspense boundary. The preview delay is intentionally retained for this lab.

The client Demo scenario selector affects only the next load/retry:

| Selection  | Behaviour                                                                              |
| ---------- | -------------------------------------------------------------------------------------- |
| Success    | Real posts request in the browser.                                                     |
| Slow       | Two-second wait, then the real browser request.                                        |
| HTTP error | Local Response with status 503 enters the shared response checker and throws ApiError. |
| Empty      | Local successful Response containing `[]` enters the same JSON parsing path.           |

Simulated HTTP and empty results do **not** come from JSONPlaceholder. To test recovery: select HTTP error, load, observe Retry, change to Success, then Retry. Both server sections remain independent. HTTP/network/parse errors have separate safe messages; fetches have a 12-second timeout.

## Checks and evidence

```sh
npm run lint
npm test
npm run build
```

For browser checks, run a production server on port 3003, install a Playwright browser with `npx playwright install chromium`, and run `npm run test:browser` in another terminal. With installed Edge in PowerShell:

```powershell
$env:BROWSER_CHANNEL = 'msedge'
npm run test:browser
```

Set `BASE_URL` for another local port. The tests require Internet access for real API scenarios. They regenerate screenshots and a timing/request JSON record in `docs/evidence/`.

- [Interview: preserved initial predictions and explanation notes](docs/INTERVIEW.md)
- [Testing: actual outcomes, limitations, and screenshots](docs/TESTING.md)
- [Submission draft](docs/SUBMISSION.md)

## Git milestones

Branch: `assignment-3-maya-interview`.

- Initial prediction checkpoint committed before feature implementation.
- Server profile/independent delayed preview milestone.
- Client explorer and scenario controls milestone.
- Final verification and documentation milestone.

Dependencies, build output, and environment files are ignored. The assignment is separate from Assignment 2.

## Limitations and submission status

Local implementation and required main scenarios have been verified. Browser-induced server-profile and server-preview failures remain unverified; see TESTING.md. API/network availability and streaming behaviour can vary. No deployment is included. The public repository and remote push are now complete; email status is recorded in docs/SUBMISSION.md.

The initial predictions and final explanations are clearly labelled agent-authored. The student must review them and add their own understanding and direct observation without backdating initial predictions. The full name is Ghady Nazha; public repository and branch links appear below. Recording a 2–4 minute walkthrough is optional and has not been created.


## Publication update — 25 October 2026

Author: **Ghady Nazha**. Public repository: [GHady98/maya-employee-explorer](https://github.com/GHady98/maya-employee-explorer). Assignment branch: [assignment-3-maya-interview](https://github.com/GHady98/maya-employee-explorer/tree/assignment-3-maya-interview). Existing milestone history is preserved. Publication is complete; see docs/SUBMISSION.md for the email record and remaining coursework limitations.

Submission email sent on 25 October 2026 to khaled@techtalkslb.com and confirmed in Gmail Sent. The message discloses the remaining coursework limitations; publication and sending do not establish instructor acceptance.

## Instructor follow-up — 31 October 2026

Khaled reviewed the implementation. Personal learning evidence is still required; see [remaining requirements](docs/INSTRUCTOR-FOLLOW-UP.md). This checklist records his feedback and does not claim the student work is complete.
