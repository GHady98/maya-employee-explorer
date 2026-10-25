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
