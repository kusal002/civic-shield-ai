# CivicShield AI — Product Blueprint & UX Flow

## Product Promise

CivicShield AI turns an unclear civic problem or urgent public-safety concern into a structured report, practical next steps, and a formal complaint draft in a few minutes.

**Core journey:** Choose the situation → understand the risk → take safe action → submit, route, and verify a clear report.

> CivicShield AI provides general public-safety guidance. It does not replace police, fire, ambulance, or other emergency services. Users are always directed to contact local emergency services when there is immediate danger.

---

## Primary User

**A citizen** who notices a local issue—such as waterlogging, garbage overflow, exposed wiring, a broken streetlight, or an accident risk—and needs to understand what to do and how to report it properly.

---

## Site Map

```text
Home
 ├── Service 1: Report a civic issue
 │    ├── Describe the situation
 │    ├── Add location and details
 │    └── AI safety analysis
 │         ├── Complaint draft
 │         ├── Shareable safety card
 │         ├── Submit to responsible department
 │         └── Track and verify resolution
 ├── Service 2: Emergency assistance
 │    ├── Immediate safety screen
 │    ├── Call 112
 │    ├── Safety checklist
 │    └── Optional post-emergency civic follow-up
 ├── Community issue dashboard
 │    └── Issue detail, status timeline, and verification
 └── Moderator workspace (hackathon demo)
      ├── Review reports
      ├── Update case status
      └── Check closure evidence
```

---

## Home Page: Two Clear Services

The home page is the decision point. It should introduce CivicShield, explain why it exists, and then let the citizen choose the correct path without confusion.

### Home-page order

1. **Hero** — calm, modern public-safety message and a short trust statement.
2. **Two service cards** — the primary decision.
3. **How CivicShield works** — a three-step explanation.
4. **Community proof** — lightweight issue statistics and recent reports.
5. **Safety and transparency note** — CivicShield is not an emergency dispatch service or government authority.

### Service card 1: A civic issue that is not immediately dangerous

**Label:** `Report a civic issue`

**Description:** “Report problems such as garbage overflow, broken streetlights, drainage, road damage, water leakage, or unsafe public infrastructure.”

**CTA:** `Start a report`

This starts the civic-reporting workflow. The citizen can describe the issue naturally, receive structured AI assistance, approve a department-ready complaint, and track the result.

### Service card 2: An immediate emergency

**Label:** `I need emergency help now`

**Description:** “For fire, serious injury, exposed live wiring, collapse, violence, or any immediate danger.”

**CTA:** `Get emergency help`

This opens the emergency screen immediately. It does **not** wait for a report or AI response. Its first action is `Call 112 Now`, followed by minimal safety guidance. India’s unified emergency response number is 112.

---

## Service Decision Logic

```text
Citizen opens CivicShield
        ↓
Chooses a service, or types a description
        ↓
Is there an immediate threat to life, health, or physical safety?
        ├── Yes → Emergency flow: Call 112 + immediate safety guidance
        └── No  → Civic flow: AI analysis + complaint + tracking
```

If a citizen enters a civic report but uses emergency signals such as “fire”, “unconscious”, “live wire”, “collapse”, or “serious accident”, the application interrupts the normal flow and shows emergency guidance first. This local check works even when the free AI provider is unavailable.

---

## Emergency UX Flow

```text
Emergency service card / emergency signal detected
→ High-contrast emergency screen
→ Call 112 Now (opens the device dialler on mobile)
→ Show 3–4 situation-specific safety steps
→ Ask “Are you safe?”
→ Optional: save a post-emergency civic hazard report
```

### Emergency-screen rules

- The emergency call-to-action is always the largest action.
- No user has to wait for analysis, loading, email delivery, or registration.
- Instructions are short, action-led, and avoid medical or legal diagnosis.
- The interface never claims that CivicShield contacted emergency services.
- A follow-up report is secondary and only appears after the safety action.

---

## End-to-End UX Flow

### 1. Landing Page — Build trust and set urgency

The first screen should feel like a credible civic-service product, not a generic AI chatbot.

The user sees:

- A concise headline: **“Report civic problems. Get safer next steps.”**
- Two primary service cards: **Report a civic issue** and **I need emergency help now**.
- A visible emergency notice: **“Immediate danger? Call 112 first.”**
- Three simple explanations: report, AI-guided safety action, verified tracking.
- A small live-looking summary of active community reports.

**User decision:**

- If the situation is not immediately life-threatening, select **Report a civic issue**.
- If it is an emergency, select **I need emergency help now** and call 112 before continuing.

### 2. Issue Reporter — Let people speak naturally

The report form avoids bureaucratic language. The first and largest field asks:

> “What happened? Describe the problem in your own words.”

Example helper text:

> “The road near the market is waterlogged and there is an exposed wire beside it.”

The user then adds:

| Field | UX purpose |
| --- | --- |
| Problem description | Captures the issue in natural language. |
| Location / landmark | Makes the report feel actionable and local. |
| Time or duration | Shows whether the issue is ongoing or new. |
| Photo attachment (optional) | Adds realism; it can remain optional in the MVP. |
| Affected people / extra detail | Captures risk context without overwhelming the user. |

**Primary CTA:** `Analyze safety and create report`

The form should show a short privacy note and avoid collecting unnecessary personal information.

### 3. Processing State — Reassure the user

After submission, show a short, intentional progress state rather than a blank loader:

1. Understanding the issue
2. Checking possible public risk
3. Preparing safety steps and a complaint draft

This makes the AI contribution visible and sets the expectation that the result will be structured.

### 4. AI Analysis — Make the output instantly understandable

The result page is the product’s core moment. The most important information appears at the top:

- **Issue category:** e.g. Drainage and electrical hazard
- **Urgency:** Low, Medium, High, or Critical
- **Risk summary:** one clear sentence in plain language
- **Immediate action:** the next safest action the user can take

For example:

```text
HIGH URGENCY
Waterlogging near an exposed electrical wire may create an electrocution risk.

Avoid the area, keep others away, and contact the responsible authority or emergency services if there is an immediate threat.
```

The remainder of the page is presented in clear sections, not a long AI response:

1. **What we understood** — structured summary of the citizen’s report.
2. **Why it matters** — public risk in simple language.
3. **What to do now** — short safety-first checklist.
4. **Formal complaint** — ready-to-copy authority-facing text.
5. **Share with others** — public safety card.

### 5. Critical-Emergency Branch — Safety before reporting

If the analysis indicates fire, a medical emergency, an active electrical danger, a serious accident, building collapse, or another immediate threat, the interface changes priority.

The result begins with a high-contrast emergency banner:

> **Possible immediate danger. Move to safety and contact local emergency services now.**

The user can still save a report, but the primary action is safety—not generating a complaint. The interface should never imply that waiting for AI guidance is appropriate in a life-threatening emergency.

### 6. Complaint Generator — Convert concern into action

The formal complaint panel has three tabs:

- **Formal complaint** — municipality, ward office, housing society, or campus administration.
- **Email format** — a concise subject line and message body.
- **Public alert** — short, non-alarmist text suitable for a resident group.

Actions:

- Copy text
- Download as text/PDF later if time permits
- Edit before sharing

The generated copy remains respectful, factual, and specific about location and risk. It must not invent facts or state that authorities have been contacted.

### 7. Shareable Safety Card — Help the community respond safely

The user can create a compact visual card containing:

- Issue title and category
- Locality / landmark
- Urgency badge
- One-sentence risk summary
- Immediate safety instruction
- Report status

Actions:

- Download card
- Copy public-alert text
- Return to dashboard

The card should have an official, calm visual style. It informs people without creating panic.

### 8. Submit, Route, and Publish — Give the report a believable lifecycle

Before saving, the user confirms:

- Location is correct
- No private or sensitive information is included
- They understand that the report is community-visible in the MVP

Before sending, the citizen reviews the department, recipient email, and complaint text. They explicitly approve the message being sent in their name.

After sending or saving, show a confirmation screen:

> **Report CS-2026-0148 created successfully**

The report enters the dashboard with status **Submitted to Department** only after the email service returns a delivery result. A locally saved report that has not been sent remains **Draft** or **Ready to Submit**.

For the hackathon version, seeded reports make the dashboard look populated from the start. Real email routing is enabled only for a verified department directory in a selected pilot city; the project must never invent delivery or government acknowledgement.

### 9. Public Dashboard — Show shared civic awareness

The dashboard answers: *What is happening around the community?*

It includes:

- KPI cards: active reports, high-priority reports, resolved reports
- Filters: category, urgency, status, locality
- Search: location or issue type
- Report cards with severity, status, locality, submitted time, and short summary
- A small category or urgency chart for a civic-operations feel

Each report card opens the same structured safety summary available to the original reporter. Dashboard reports should use realistic but clearly demo-safe sample data.

---

## Resolution and Trust Model

CivicShield distinguishes an authority’s claim from an actual community-verified resolution. This is essential for genuine public accountability.

```text
Draft
→ Submitted to Department
→ Delivery Confirmed
→ Acknowledged by Department
→ Assigned for Action
→ Work in Progress
→ Department Marked Resolved
→ Community Verification Pending
→ Verified Resolved / Disputed / Reopened / Overdue
```

### What each closure label means

| Label | Meaning |
| --- | --- |
| Department Marked Resolved | The authority says work is complete; this is not yet independently verified. |
| Community Verification Pending | The reporter or local community is asked to confirm the on-ground condition. |
| Verified Resolved | A citizen/moderator confirms the issue is actually resolved, ideally with current evidence. |
| Disputed / Reopened | The fix is incomplete, the problem persists, or it has returned. |
| Overdue / No response | The expected acknowledgement or update has not been received. |

### Who manages each part

| Role | Responsibility |
| --- | --- |
| Citizen | Creates report, approves department email, and confirms or disputes closure. |
| Responsible department | Acknowledges, updates, assigns work, and provides closure evidence when integrated. |
| CivicShield moderator | Reviews unsafe or abusive reports, records verified updates, and follows up on stale cases. |
| AI | Structures information, proposes routing, drafts communication, and never declares a real-world issue solved by itself. |

---

## Report Status Lifecycle

```text
Received → Under Review → Assigned → Resolved
```

For the MVP, seeded status changes demonstrate the workflow. Only a logged email delivery, official acknowledgement, moderator update, or citizen evidence may be presented as a real event.

---

## Urgency Design Rules

| Level | Meaning | Interface treatment |
| --- | --- | --- |
| Low | Inconvenient but not an immediate safety concern | Neutral blue/grey badge; standard report action. |
| Medium | Needs timely attention | Amber badge; encourage formal reporting. |
| High | Public safety risk or major disruption | Orange/red badge; put safety steps first. |
| Critical | Potential immediate danger | Red emergency banner; prioritize moving to safety and contacting emergency services. |

Urgency is guidance, not an official emergency classification.

---

## One-Minute Demo Script

1. Start on the landing page and explain the citizen-first purpose.
2. Click **Report an Issue**.
3. Enter: “The road near Central Market is waterlogged and an exposed wire is lying beside the footpath.”
4. Add a believable locality and submit.
5. Show the **High Urgency** analysis and immediate safety guidance.
6. Open the formal complaint and copy-ready public alert.
7. Generate the shareable safety card.
8. Save the report and open the dashboard to show it alongside existing community reports.

This demonstrates the complete promise: a vague observation becomes a safe, structured, usable civic report.

---

## UX Principles

- **Safety first:** emergency direction is never hidden behind the AI flow.
- **Plain language:** citizens should not need civic-administration knowledge.
- **Minimal input:** ask only for details that make reporting useful.
- **Calm credibility:** use clear, restrained public-service visual design.
- **Transparent AI:** label guidance as AI-assisted and avoid overclaiming certainty.
- **Always reliable:** use local fallback analysis when the free API is unavailable or rate-limited.

---

## 2026-Ready Product Features

The design should feel current because AI is embedded in a useful, accountable workflow—not because it looks like a chatbot.

- **Natural-language reporting:** citizens describe a problem normally rather than navigating complex forms.
- **Structured AI output:** category, urgency, risk, routing, complaint, and next steps appear in predictable cards.
- **AI with human control:** the citizen approves outbound email; a moderator validates status changes.
- **Evidence-aware resolution:** closure is separated from community verification.
- **Resilient AI workflow:** deterministic safety rules work without an API; free AI improves clarity when available.
- **Mobile-first PWA experience:** large touch targets, location-first reporting, and fast emergency access.
- **Calm civic design:** polished public-service interface, restrained motion, clear hierarchy, and accessible colour contrast.

---

## Technical Architecture (Free-Tier First)

| Area | Chosen approach | Reason |
| --- | --- | --- |
| Frontend | Next.js + TypeScript | Reliable modern web app structure. |
| UI | Tailwind CSS + shadcn/ui + Lucide | Sleek, accessible interface without building primitives from scratch. |
| AI | Groq free API | Fast structured analysis within free-tier limits. |
| AI resilience | Local rule-based fallback | Emergency detection and demo flow cannot depend on a free API. |
| Data in MVP | localStorage + seeded data | Zero database cost and reliable demo behavior. |
| Email | Provider abstraction; enabled only after pilot-city directory is verified | Avoids claiming government contact without a confirmed recipient. |
| Validation | Zod + React Hook Form | Safer user input and structured AI output. |
| Deployment | Vercel free tier | Quick hackathon deployment. |

### Free-API safeguards

- Keep the API key server-side only.
- Limit generated output length and retry only once on rate limiting.
- Cache the current report analysis in browser storage.
- If AI fails, show a transparent “fallback safety assessment” and continue.
- Never use AI as the sole detector for an emergency.

---

## Planned Folder Structure

```text
civic-shield-ai/
├── app/
│   ├── page.tsx                         # Home: two service choices
│   ├── report/page.tsx                  # Non-emergency civic workflow
│   ├── emergency/page.tsx               # Immediate help and safety guidance
│   ├── analysis/[reportId]/page.tsx     # Structured report result
│   ├── dashboard/page.tsx               # Community reports and filters
│   ├── report/[reportId]/page.tsx       # Timeline, evidence, verification
│   ├── moderator/page.tsx               # Demo review workspace
│   └── api/
│       ├── analyze/route.ts             # Secure AI request
│       └── notifications/route.ts       # Future verified email dispatch
├── components/
│   ├── landing/                          # Hero, service cards, how-it-works
│   ├── report/                           # Form and location details
│   ├── emergency/                        # Emergency panel and safety steps
│   ├── analysis/                         # Urgency, complaint, routing cards
│   ├── dashboard/                        # Filters, stats, report cards
│   ├── moderator/                        # Status and evidence controls
│   ├── shared/                           # Navigation, badges, layout
│   └── ui/                               # Reusable UI primitives
├── lib/
│   ├── ai/                               # Groq client, prompts, fallback rules
│   ├── data/                             # Seed reports, guides, departments
│   ├── storage/                          # localStorage report persistence
│   ├── email/                            # Provider abstraction (later)
│   └── utils.ts
├── hooks/
├── types/
├── public/
│   ├── images/
│   ├── icons/
│   └── manifest.json
├── .env.example
└── README.md
```

---

## Build Plan: Small Milestones

We will complete one milestone at a time and pause after each one for review. This protects limited credits and keeps the project stable.

| Step | Deliverable | Status |
| --- | --- | --- |
| 1 | Product blueprint: UX, flows, architecture, folder structure | Complete in this README |
| 2 | Project scaffold and design system only | Complete |
| 3 | Home page with the two service choices | Complete |
| 4 | Civic reporting form, map location, and local evidence storage | Complete |
| 5 | Emergency page with instant local safety detection | Pending |
| 6 | Free-AI analysis with a reliable fallback | Complete |
| 7 | Complaint, routing preview, and citizen-confirmed email workflow | Complete for the hackathon MVP |
| 8 | Public dashboard, status timeline, and verification UI | Pending |
| 9 | Mobile polish, demo data, testing, and deployment readiness | Pending |

### Step 2 delivery notes

The project foundation now includes:

- A strict TypeScript Next.js App Router scaffold.
- Tailwind CSS design tokens for a calm, trustworthy civic-service visual system.
- Shared `Button`, `Card`, and `Badge` primitives, with accessible focus states and urgency-ready colour variants.
- A no-network typography stack that prefers Manrope/Inter when installed locally and falls back to polished system fonts, keeping local and production builds reliable.
- Shared utility and civic report types to keep future features consistent.
- All planned feature-route and component directories, ready for incremental implementation.
- Free-tier-safe environment variable placeholders; no API key has been added.

The temporary home screen only confirms that the foundation is working. It is deliberately not the final landing page; that belongs to Step 3.

### Step 2 verification

The scaffold has passed the following checks:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

### Step 3 delivery notes

The landing page now delivers the product's primary decision clearly:

- An always-visible `112` emergency notice at the top of the page.
- A strong, public-service-quality hero with a realistic safety-report preview.
- Two distinct, equally clear entry paths: `Report a civic issue` and `I need emergency help`.
- A plain-language three-step explanation of the civic reporting process.
- An accountability section that explains the difference between a department claim and community-verified resolution.
- Responsive desktop and mobile layouts, reviewed in a live browser preview.

The service links are intentionally routed to `/report` and `/emergency`, which are the next two planned workflows. Those routes will be implemented in Steps 4 and 5.

### Step 4 delivery notes

The civic reporting workflow now includes:

- A `/report` page with a mobile-friendly civic issue form.
- Natural-language issue description, location/landmark, time or duration, affected people/area, optional image filename capture, and extra details.
- Zod + React Hook Form validation that keeps required report details useful without asking for unnecessary personal information.
- Browser-local report persistence through `localStorage`.
- Local report IDs in the `CS-YYYY-0001` format.
- Saved reports marked as `Ready to Analyze`, keeping AI analysis, complaint generation, email routing, emergency interruption, and dashboard publishing separate for later milestones.
- A local saved-report confirmation panel and stored-report count.

### Step 4 verification

The Step 4 implementation has passed the following checks:

- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`

### Step 4, 6, and 7 delivery notes

The civic workflow now supports:

- **Precise location selection:** search an address/landmark, use current device location, or place a pin on the interactive OpenStreetMap map. The user sees the selected location and must confirm it before submission.
- **Evidence capture:** select up to four images/videos or use the mobile camera capture option. Files are retained in local browser storage (IndexedDB) for the MVP.
- **AI safety brief:** the analysis endpoint uses the Groq free API when `GROQ_API_KEY` is configured. If there is no key, no quota, or no network, the same flow continues with a transparent, deterministic local safety assessment.
- **Department routing:** the app suggests an appropriate municipal department based on the reported issue. This is a suggestion, not a claim that a department has been contacted.
- **Complaint and email drafting:** users can copy a formal complaint, regenerate a new email version, edit the subject/body, enter a verified official department address, and explicitly approve opening the email in their own mail application.

### Free service configuration

Copy `.env.example` to `.env.local` and add a free Groq key to enable live AI:

```text
GROQ_API_KEY=your_free_groq_key
GROQ_MODEL=llama-3.1-8b-instant
```

The map uses OpenStreetMap tiles and Nominatim geocoding; no paid map key is required. Location search is designed for low-volume hackathon use and includes a manual pin fallback.

### Gmail sending configuration

For direct, citizen-confirmed sending from a Gmail account, configure Google OAuth in `.env.local`:

```text
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/gmail/callback
```

In Google Cloud Console, the redirect URI must match exactly. For Vercel, add the production callback URL there and set the same production URL in Vercel environment variables:

```text
https://YOUR-VERCEL-PROJECT.vercel.app/api/auth/gmail/callback
```

The report page now prevents nested forms, so location search works without hydration errors. Reverse geocoding displays both the readable address/locality and exact latitude/longitude after map pinning or current-location selection.

### Email boundary

The citizen must still review the recipient and message, check the authorization box, and connect their Gmail before CivicShield sends a message. The Gmail access token is kept in a secure, HTTP-only browser cookie for its short access-token lifetime. The normal fallback remains a citizen-approved `mailto:` draft. Attachments are kept on the device and must be added manually; direct Gmail attachment delivery belongs to the cloud-storage milestone.

**Current stopping point:** The civic form, map, local evidence, AI brief, and editable email draft are implemented. The dedicated immediate-emergency route and the public/moderator dashboard remain the next planned milestones.

## MVP Boundary

The one-day version intentionally excludes authentication, direct official emergency dispatch, real-time maps, and permanent cloud storage. It proves the most valuable user experience first: clear reporting, safer action, structured communication, transparent routing, and community-verified accountability.
