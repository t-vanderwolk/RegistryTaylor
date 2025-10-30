# 🍼 Taylor-Made Baby Co. — Codex To-Do List
### Post-Memory Rebuild Priorities

This document tracks all high-priority fixes and enhancements to complete once Codex memory is restored.

---

## 🧭 PHASE 1 – MARKETING / PRE-LOGIN FIXES
**Goal:** Make the public-facing experience match the dashboard’s design polish.

- [ ] **Restyle Pre-Login Pages**
  - Apply the same navbar & footer styling as the authenticated dashboard (mauve–ivory palette, Great Vibes + Playfair Display fonts).
  - Ensure all pages (`/`, `/how-it-works`, `/membership`, `/blog`, `/request-invite`, `/login`) use the shared `Navbar.tsx`.
  - Fix mobile responsiveness on hero banner and CTA buttons.
  - Add a soft mauve background gradient to match the dashboard theme.
  - ✅ **Add rule:** On **logout**, users are redirected back to the **homepage** (`/`).

- [ ] **Fix Blog Page**
  - Wire `/blog` to `/api/blog` route for dynamic rendering.
  - Style article cards with `rounded-[2rem]` and pastel shadows.
  - Add pagination and “Featured Post” section.

---

## 💻 PHASE 2 – DASHBOARD REBUILD & INTERACTIVITY
**Goal:** Make the member dashboard fully wired, clickable, and routed.

- [ ] **Add “Dashboard” to Authenticated Navbar**
  - Add `Dashboard` link pointing to `/dashboard`.
  - Keep `Learn`, `Plan`, `Connect`, and `Journal` visible.
  - Highlight active section with mauve underline.

- [ ] **Wire Dashboard Tiles**
  - “Academy Progress” → `/dashboard/learn`
  - “Dynamic Registry” → `/dashboard/plan`
  - “Community” → `/dashboard/community`
  - “Journal” → `/dashboard/journal`
  - “Mentor Messages” → `/dashboard/messages`
  - Add hover animation and shadow-lift effect.

- [ ] **Connect API Data**
  - Populate cards with `getModuleProgress`, `getRegistryStats`, `getAnnouncements`.
  - Re-enable live **Affiliate Perks of the Week** feed.

---

## 💬 PHASE 3 – COMMUNITY & MENTOR SYSTEM
**Goal:** Bring real member interactivity online.

- [ ] **Enable Member ↔ Mentor Messaging**
  - Rebuild `/dashboard/messages` route.
  - Use Supabase Realtime or Firebase for instant chat.
  - Show mentor avatar, unread count, timestamps.
  - Include emoji picker & file attachments.

- [ ] **Build Community Forum Threads**
  - Create `/dashboard/community` route.
  - Add forum categories (Pregnancy │ Nursery │ Gear │ Postpartum │ Lifestyle).
  - Mentors can **pin** posts or mark “Featured Advice.”
  - Add upvotes and threaded replies.
  - Integrate rich-text editor (TipTap / React-Quill).
  - Style with rounded pastel cards & gold dividers.

---

## 📓 PHASE 4 – WORKBOOK ENHANCEMENTS
**Goal:** Make journaling interactive, visual, and emotionally resonant.

- [ ] **Embed Pinterest Boards**
  - Integrate Pinterest Embed API in:
    - `/dashboard/journal` (Moodboard section)
    - `/dashboard/learn/workbook` (module moodboard)
  - Allow members to pin directly inside the app.

- [ ] **Interactive Workbook Fields**
  - Auto-save and sync reflections.
  - Add image-upload field (nursery / inspiration).
  - Add **Mood Selector** (emoji scale 1–5).
  - Enable “Export as PDF” → *My Baby Journey* keepsake.

---

## ✨ PHASE 5 – POLISH & OPTIMIZATION
**Goal:** Prep for Beta relaunch.

- [ ] Clean up routing & remove dead imports.
- [ ] Run ESLint + Prettier pass.
- [ ] Add custom 404 / maintenance page.
- [ ] Implement soft fade-in page transitions.
- [ ] Verify SEO meta tags on all public pages.

---

## 🗂️ OPTIONAL (POST-BETA)
- [ ] Mentor Dashboard (manage mentees / earnings / notes)
- [ ] Affiliate Dashboard (MacroBaby click + conversion tracking)
- [ ] Analytics via PostHog or Mixpanel (engagement metrics)

---

**Brand Reminder**
> Maintain consistent luxury palette (mauve #C8A1B4, blush #EAC9D1, ivory #FFFAF8, gold #D9C48E, charcoal #3E2F35)  
> Fonts: *Great Vibes* (headers), *Playfair Display* (subheads), *Nunito* (body).

---

© Taylor-Made Baby Co. | Codex Rebuild Checklist 2025