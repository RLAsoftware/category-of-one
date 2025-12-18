### Performance QA Brief – Category Of One App

#### High-level baseline

- **Frontend bundle**: `dist` ≈ 1.0 MB, `dist/assets` ≈ 988 KB, built with Vite 5 + React 19 (`package.json`, `vite.config.ts`), long-lived caching for `/assets/*` and no-cache for `index.html` (`vercel.json`) – good foundation for SPA performance.
- **Edge functions latency**:
  - `category-of-one-chat`: typically **2.3–3.3 s** per POST (LLM streaming; acceptable but user-visible).
  - `list-claude-models`: ~**0.3–0.6 s**.
  - `synthesize-category-of-one`: **6.6 s** up to **75–86 s** for some runs (heavy LLM synthesis).
  - `set-client-password`: ~**0.4–0.7 s**, with multiple 500s (reliability more than perf).
- **Database**: migrations already add **indices on hot flags** (`flagged_for_review`, `needs_review`) and track `message_count` for sessions, which supports admin queries and turn-limit logic efficiently (`20241217080000_error_handling_and_safeguards.sql`).

---

#### Frontend performance assessment

- **Chat flow (`useCategoryOfOneChat`, `ChatInterface`)**
  - Streaming is implemented efficiently: **single assistant message updated incrementally** during reads, avoiding a new message per chunk and keeping DOM churn low.
  - The streaming watchdog prevents the UI from getting stuck in “streaming” state and aborts hung requests after 60s – good for perceived reliability, neutral for speed.
  - Micro-optimizations:
    - `sendMessage` builds `apiMessages` from `messages` captured in closure; best practice is to compute from latest state (functional `setMessages` or a ref) to avoid any stale state issues.
    - `ChatInterface` recalculates `hasStreamingMessage` with `messages.some` each render; for very long sessions, consider tracking this in state in the hook and passing it down.
    - Auto-scroll uses `scrollIntoView({ behavior: 'smooth' })` on every message change; for long transcripts, gate this on “user near bottom” or debounce to avoid jank.

- **Dashboard & sessions (`useDashboard`, `SessionList`)**
  - `useDashboard` currently re-fetches full session lists on any realtime `interview_sessions` or `category_of_one_profiles` change.
  - For larger tenants this can be costly: many small updates trigger **full table re-fetches**, increasing latency and DB load.
  - Recommended:
    - In realtime handlers, **apply diffs in memory** (INSERT/UPDATE/DELETE) instead of full reloads.
    - Optionally throttle a full refresh as a periodic safety (e.g., once every 30–60 s or on tab focus).
  - `SessionList` is fine for dozens of sessions; if you expect hundreds, consider **virtualized lists**.

- **Interview base/follow-up flows (`useInterview`)**
  - Each step performs a small number of Supabase calls and one edge-function call (`generate-followups`, `synthesize-profile`).
  - Primary perception of slowness is **LLM latency**, not React; ensure spinners/messaging remain clear during these waits.

---

#### Backend & edge functions performance assessment

- **Chat function (`supabase/functions/category-of-one-chat/index.ts`)**
  - Uses Anthropic streaming (`stream: true`), forwarding `content_block_delta` text chunks via SSE; this is efficient and gives good interactivity.
  - For ongoing chats, it sends the **entire message history** with each call; as sessions grow, this inflates tokens and latency.
  - Recommendations:
    - Implement **conversation windowing/summarization** once a session reaches ~30–40 messages (summary of earlier turns + last N verbatim turns).
    - Consider lowering `max_tokens` for chat messages where responses should be concise (e.g., 256–512) to reduce generation time.

- **Synthesis function (`supabase/functions/synthesize-category-of-one/index.ts`)**
  - Heavy LLM usage (`max_tokens: 8192`, large schema, retries) leads to **6–80 s** runtimes in some logs.
  - Robust validation and retry logic improve correctness but increase worst-case latency.
  - Recommendations:
    - Reduce **prompt and transcript size**: summarize earlier conversation, strip boilerplate, and keep the system prompt as tight as possible.
    - Lower `max_tokens` to a realistic upper bound (e.g., 4096) if business requirements allow.
    - Consider making synthesis **asynchronous** (quick 202/accepted, poll or subscribe for completion) instead of blocking the user while all retries happen.

- **Interview style functions (`generate-followups`, `synthesize-profile`)**
  - Use `gpt-4o` with structured JSON output; observed to be far faster than the Anthropic synthesis calls.
  - Main lever is further prompt tightening and `max_tokens` trimming if needed.

- **Database access patterns**
  - Hooks and functions use targeted filters on `client_id`, `session_id`, and flags; indices from migrations support efficient querying.
  - Watch for **very large transcripts** when fetching all `chat_messages` for a session (`initializeChat` and `loadSession`); if this becomes common, fetch only the **tail** or paginate.

---

#### Infra & build configuration

- **Vite & TypeScript**
  - `vite.config.ts` with `react()` and `tailwindcss()` uses Vite’s standard production optimizations (tree-shaking, minification, modern ESM).
  - `tsconfig.app.json` targets `ES2022` with strict settings and bundler module resolution – good for both performance and DX.

- **Deployment & caching**
  - `vercel.json`:
    - `index.html` is non-cacheable (fast rollout of new deployments).
    - `/assets/(.*)` has `public, max-age=31536000, immutable` (optimal for hashed bundles).
  - No immediate infra changes required; as assets grow, ensure images/fonts remain optimized and consider additional code splitting for any very large dependencies.

---

#### Top performance opportunities (prioritized)

- **P1 – Optimize long-running synthesis**
  - Problem: `synthesize-category-of-one` calls can run tens of seconds or more, impacting the “generate my profile” experience.
  - Actions:
    - Add **transcript summarization** before synthesis (summarize older turns + keep recent turns verbatim).
    - Reduce `max_tokens` and tighten the system prompt.
    - Optionally make synthesis **async** with progress UI instead of blocking until completion.

- **P1 – Limit LLM context size for chat**
  - Problem: chat sends full history every turn, so token and latency costs grow with session length.
  - Actions:
    - Implement a **sliding context window** or summary for earlier context.
    - Optionally cap per-message length to prevent pathological inputs.

- **P2 – Reduce dashboard realtime load**
  - Problem: any change triggers full session/profile re-fetches.
  - Actions:
    - Apply changes incrementally in `useDashboard` realtime handlers.
    - Debounce any full refresh to a sensible interval.

- **P2 – Optimize large-session resume**
  - Problem: full `chat_messages` history is loaded on resume for long sessions.
  - Actions:
    - Fetch only the **last N messages** for display and model context, or paginate older history.

- **P3 – UI micro-optimizations**
  - Actions:
    - Limit auto-scroll behavior for extremely long transcripts.
    - Introduce list virtualization if session counts grow large.
    - Use `React.memo` or similar where high-frequency state changes cause deep re-renders.

---

#### Regression checklist

Run these checks after significant changes to chat, interview, or synthesis logic:

- **Core flows**
  - Login → Dashboard loads quickly (< ~2 s perceived) with few and many sessions.
  - Dashboard → resume long chat (≥40 messages) remains smooth; sending a message yields visible streamed output within ~4–5 s under normal conditions.
  - Chat → synthesize profile: clear “synthesizing” state and completion within target window (for synchronous) or clear async progress pattern.
  - Interview base/follow-up flows: spinners and status messages appear immediately and remain responsive during LLM calls.

- **Metrics & logs**
  - `category-of-one-chat` P95 latency stays within the target (e.g., < 4 s).
  - `synthesize-category-of-one` P95 latency meets agreed budget (e.g., < 30 s) with retry rate monitored.
  - DB queries for sessions, messages, and profiles continue to hit indices and avoid full-table scans on hot paths.

- **Client behavior**
  - Long sessions do not cause noticeable lag in typing or scrolling.
  - Realtime updates do not cause excessive Supabase traffic or repeated full reloads of session data.


