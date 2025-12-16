## Category of One App – Executive Summary for Management

### What the app does

- **Purpose**: This app is a guided **“Category of One” engine**. It interviews each client (or brand) in natural language and then **synthesizes a structured positioning profile** that RTR can use across content, strategy, and operations.
- **Client flow**:
  - Client logs in (or is onboarded).
  - A **chatbot runs an interview** to uncover their positioning, voice, and differentiation (their Category of One).
  - When the interview is complete, the system **generates a written Category of One profile** and stores it in the database, with export as Markdown.
- **Admin capabilities**:
  - Invite and manage admin users.
  - Choose which **Claude model** is used (e.g. `claude-3-5-sonnet-latest`).
  - View and edit the **two core prompts** that control the chatbot and the profile generation, via an in-app UI (no code deploys needed).

All of this is accessible at `Admin → Settings → LLM → LLM Configuration` in the app.

---

### The two prompts management owns

There are two key prompts that define how the system behaves. They live in the database and are editable from the admin UI:

1. **Chat system prompt (interview)**
2. **Synthesis system prompt (profile generation)**

These are the “brains” of the system. Changing them changes how the bot interviews and how the final Category of One profile is written.

---

### 1. Chat system prompt (interview)

**What it is**

This is a long, detailed instruction given to Claude that defines:

- Who it is (for example: “You are an elite Category of One strategist and interviewer…”).
- Who it’s talking to (founders, experts, course creators, etc.).
- The **exact information** to extract during the conversation, such as:
  - Who they serve (WHO).
  - The outcome they deliver (WHAT).
  - Their unique method / framework (HOW).
  - Their unique differentiation and positioning.
  - Their contrarian beliefs and “edge”.
  - The gap they fill (frustrations before vs. outcomes after).
  - Proof points, stories, and examples.
- How to behave as an interviewer:
  - Ask **one question at a time** (no multi‑part questions).
  - Refer back to previous answers, not treating each question in isolation.
  - Ask for examples, stories, and specifics when answers are vague.
  - Challenge assumptions gently where useful (e.g., “Can you give me a concrete example of that?”).
  - Keep responses short (typically 2–4 sentences) so the human isn’t overwhelmed.
  - Use the client’s name and keep tone consistent with our brand.

The prompt also instructs Claude to signal when it has enough information by outputting a special marker such as **`[SYNTHESIS_READY]`**. That marker tells the app to move into the synthesis phase.

**How it’s used**

- This prompt is sent as the **system prompt** on *every* chat request during the interview phase.
- It is combined with the **full conversation history** (all previous turns).
- Given this, Claude decides:
  - What to ask next.
  - When to dig deeper.
  - When it has enough, and when to emit `[SYNTHESIS_READY]`.

There is no hard‑coded list of questions in the code; the **interview strategy lives in this system prompt**.

**What management should decide for this prompt**

When authoring the Chat system prompt, management should define:

- The **complete checklist of information** every Category of One interview must capture, for example:
  - WHO they serve (persona, psychographics).
  - WHAT transformation they deliver (before → after).
  - HOW they do it (named framework, process steps).
  - What makes them different from everyone else in the market.
  - Their contrarian viewpoints / “spiky” opinions.
  - Offers, price points, and proof points.
- The interviewer’s **style**:
  - How direct vs. soft they should be.
  - How much they should challenge vague answers.
  - Whether they should summarise back key points as they go.
- Any **non‑negotiable questions** that must be answered before synthesis can happen.

In short, this prompt should encode the ideal **Category of One strategy interview playbook**.

---

### 2. Synthesis system prompt (profile generation)

**What it is**

This is a second, separate instruction that tells Claude how to:

- Read the **entire interview transcript**.
- Distill it into a structured **Category of One profile** with clearly defined sections, such as:
  - Positioning statement: “I help [WHO] achieve [WHAT] by [HOW].”
  - Unique differentiation: What makes them unlike the rest of the market.
  - Contrarian position: What they believe vs. the industry’s default beliefs.
  - The gap they fill: Client frustrations before vs. outcomes after.
  - Unique methodology: Name + explanation of their framework or process.
  - Transformation story: Before / after arc for the client.
  - Competitive landscape: Why choose them over 100 other options.
- Produce both:
  - A **strict JSON structure** (field names, nested objects) so the app can store structured data, and
  - A **Markdown profile** that humans can read and export.

**How it’s used**

- Once the interview bot outputs `[SYNTHESIS_READY]`, the app:
  - Builds a transcript from all chat messages plus the client’s name.
  - Sends that transcript to Claude with the Synthesis system prompt as the `system` message.
  - Receives back a JSON object matching the requested schema.
- The backend:
  - Saves the structured profile to the `category_of_one_profiles` table.
  - Stores the full Markdown version as `raw_profile` for reading/export.
  - Marks the interview session as `completed` in the database.

Every change to the **Synthesis system prompt** will directly change **how profiles are structured and written**.

**What management should decide for this prompt**

When writing the Synthesis system prompt, management should define:

- The **canonical structure** of a Category of One profile:
  - The exact sections, in the exact order.
  - Which sections are mandatory vs. optional.
  - How much detail belongs in each (1–2 sentences vs. small paragraphs vs. bullet lists).
- The **tone and style**:
  - Formal vs. conversational vs. bold/sales‑ready.
  - Use of storytelling, examples, and metaphors.
  - Whether it should read more like a positioning memo, a sales one‑pager, or internal brand doc.
- Any **red lines and constraints**:
  - What must never be invented or over‑stated.
  - How to handle missing information from the interview (e.g. use “Not discussed” instead of guessing).

Think of this prompt as the **brand standard for Category of One documentation**. Every generated profile should feel like it was written by the same senior strategist, even though it’s produced by the model.

---

### How management will work with these prompts in the app

1. Log in as an admin and go to **Admin → Settings → LLM → LLM Configuration**.
2. For each environment (staging vs. production if applicable):
   - In **Claude model**, select the model you want (e.g. `claude-3-5-sonnet-latest`).
   - In **Chat system prompt (interview)**, paste or edit the final interview prompt text.
   - In **Synthesis system prompt (profile generation)**, paste or edit the final synthesis prompt text.
   - Click **Save Changes**.
3. From that point onward:
   - All **new interviews** will follow the updated interview strategy.
   - All **new profiles** will be synthesized according to the updated profile template.
   - No developer redeploys are needed; prompt iteration is fully owned by the management/strategy team.

This separation—application code managed by engineering, prompts and model selection managed in the admin UI—gives RTR a flexible, evolvable Category of One system that can grow as the business matures without constant developer intervention.


