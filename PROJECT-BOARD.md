# Project Board

> Last updated: 2025-01-06 10:00

## Project Info

| Field | Value |
|-------|-------|
| Project | Category of One Bot |
| Started | 2024-12-01 |
| Current Sprint | Sprint 1 |
| Task Prefix | PM |
| Next ID | 16 |
| Sprint Length | 2 weeks |
| Team | @derick |

---

## Current Sprint: Sprint 1 (Jan 6 - Jan 17)

**Sprint Goal:** Improve interview experience and finalize branding

### Blocked
<!-- Tasks that cannot proceed -->

### In Progress
<!-- Tasks actively being worked on -->

### In Review
<!-- Tasks awaiting review or QA -->

### Done
<!-- Completed tasks this sprint -->

---

## Backlog

### High Priority
- [ ] `PM-001` **Implement interview progress UI** `high` `feature`
  - **Description:** Add visual progress indicator showing users where they are in the interview flow
  - **Acceptance criteria:**
    - [ ] Progress bar/stepper showing current section
    - [ ] Clear indication of base questions vs follow-ups vs chat
    - [ ] Estimated time remaining indicator
- [ ] `PM-002` **Finalize app naming and branding** `high` `chore`
  - **Description:** Complete branding brief deliverables - name, tagline, domain
  - **Acceptance criteria:**
    - [ ] Primary name selected with rationale
    - [ ] 2-3 alternative options documented
    - [ ] Tagline suggestions
    - [ ] Domain availability confirmed
- [ ] `PM-003` **Add interview session analytics** `high` `feature`
  - **Description:** Track completion rates, drop-off points, average session duration
  - **Acceptance criteria:**
    - [ ] Completion rate tracking
    - [ ] Drop-off point analysis
    - [ ] Session duration metrics
    - [ ] Admin dashboard widget for analytics

### Medium Priority
- [ ] `PM-004` **Implement profile comparison view** `medium` `feature`
  - **Description:** Allow clients to compare profiles across multiple interview sessions
  - **Acceptance criteria:**
    - [ ] Side-by-side profile comparison
    - [ ] Highlight differences between versions
- [ ] `PM-005` **Add bulk client import** `medium` `feature`
  - **Description:** Allow admins to import multiple clients via CSV
  - **Acceptance criteria:**
    - [ ] CSV upload interface
    - [ ] Validation and error reporting
    - [ ] Bulk invitation sending
- [ ] `PM-006` **Implement profile versioning** `medium` `feature`
  - **Description:** Track profile changes over time with version history
  - **Acceptance criteria:**
    - [ ] Version history per client
    - [ ] Ability to view previous versions
    - [ ] Restore previous version capability
- [ ] `PM-007` **Add team collaboration features** `medium` `feature`
  - **Description:** Allow multiple admins to collaborate on client profiles
  - **Acceptance criteria:**
    - [ ] Comments on profiles
    - [ ] Activity log per client
    - [ ] Notifications for team activity
- [ ] `PM-008` **Improve mobile responsiveness** `medium` `chore`
  - **Description:** Optimize interview flow for mobile devices
  - **Acceptance criteria:**
    - [ ] Touch-friendly interview interface
    - [ ] Responsive profile display
    - [ ] Mobile-optimized navigation

### Low Priority
- [ ] `PM-009` **Add dark mode support** `low` `feature`
  - **Description:** Implement dark theme toggle
  - **Acceptance criteria:**
    - [ ] Dark theme for all components
    - [ ] User preference persistence
    - [ ] System preference detection
- [ ] `PM-010` **Implement interview templates** `low` `feature`
  - **Description:** Allow customizable interview question sets per use case
  - **Acceptance criteria:**
    - [ ] Template creation interface
    - [ ] Template assignment to clients
    - [ ] Template library
- [ ] `PM-011` **Add export to Google Docs** `low` `feature`
  - **Description:** Direct export of profiles to Google Docs
  - **Acceptance criteria:**
    - [ ] Google OAuth integration
    - [ ] Formatted document export
- [ ] `PM-012` **Implement webhooks for integrations** `low` `feature`
  - **Description:** Allow external systems to receive profile updates
  - **Acceptance criteria:**
    - [ ] Webhook configuration UI
    - [ ] Event triggers (profile created, updated)
    - [ ] Retry logic for failed deliveries
- [ ] `PM-013` **Add interview audio recording option** `low` `spike`
  - **Description:** Research feasibility of voice-based interviews
  - **Acceptance criteria:**
    - [ ] Technical feasibility assessment
    - [ ] Cost analysis
    - [ ] Privacy considerations documented

---

## Icebox

<!-- Ideas and future considerations, not committed -->

- [ ] `PM-014` **Multi-language interview support** `low` `spike`
  - Research supporting interviews in languages other than English
- [ ] `PM-015` **White-label option for agencies** `low` `feature`
  - Allow agencies to customize branding for their clients

---

## Completed Sprints

<!-- Archive of closed sprints with metrics -->

---

## Notes

### Architecture Decisions
- 2024-12-01: Chose Supabase for auth and database (faster than custom)
- 2024-12-01: Using React 19 + Vite for frontend
- 2024-12-01: OpenAI GPT-4o for AI operations
- 2025-01-02: Implemented proactive token refresh (5-min buffer)

### Key Features Completed
- Full authentication system (magic link + password)
- Admin/client role-based access
- 5-question base interview + AI follow-ups
- Category of One profile synthesis
- PDF/Markdown export
- Brand knowledge document management
- Admin impersonation for testing
- Style guide documentation

### Useful Links
- Branding Brief: `planning/BRANDING_BRIEF.md`
- Feature Ideas: `planning/features.txt`

### Team Agreements
- PRs require review before merge
- All TypeScript, no JavaScript files
- Tailwind CSS for styling (custom sunset/slate/cream/ink palette)
