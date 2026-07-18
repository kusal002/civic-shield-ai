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
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Home: two service choices
│   │   ├── report/page.tsx              # Non-emergency civic workflow
│   │   ├── analysis/[reportId]/page.tsx # Structured report result
│   │   ├── dashboard/page.tsx           # Public accountability feed
│   │   └── api/
│   │       ├── analyze/route.ts         # Secure AI request
│   │       ├── geocode/route.ts         # Nominatim search/reverse geocoding
│   │       ├── reports/route.ts         # Persistent report creation
│   │       ├── reports/[reportId]/analysis/route.ts
│   │       ├── reports/[reportId]/delivery/route.ts
│   │       ├── send-email/route.ts      # Gmail send endpoint
│   │       └── auth/gmail/              # Google OAuth routes
│   ├── components/
│   │   ├── report/                       # Form, map, location and evidence capture
│   │   ├── analysis/                     # Safety brief and email composer
│   │   └── ui/                           # Reusable UI primitives
│   ├── lib/
│   │   ├── ai/                           # Groq prompt, email normalisation, fallback
│   │   ├── data/                         # Department routes and verified directory
│   │   ├── gmail/                        # Owner-Gmail access-token helpers
│   │   ├── storage/                      # Browser-local evidence/report cache
│   │   └── supabase/                     # Server-side persistence helpers
│   └── types/                            # Shared report types
├── supabase/
│   └── schema.sql                        # Run once in Supabase SQL Editor
├── public/
├── .env.example
├── package.json
└── README.md
```

> The hackathon MVP now includes `/emergency`, `/dashboard`, public report-detail pages, and a protected moderator workspace for civic and emergency report review.

---

## Build Plan: Small Milestones

We will complete one milestone at a time and pause after each one for review. This protects limited credits and keeps the project stable.

| Step | Deliverable | Status |
| --- | --- | --- |
| 1 | Product blueprint: UX, flows, architecture, folder structure | Complete in this README |
| 2 | Project scaffold and design system only | Complete |
| 3 | Home page with the two service choices | Complete |
| 4 | Civic reporting form, map location, local evidence storage, and persistent report creation | Complete |
| 5 | Emergency page with instant local safety detection | Complete |
| 6 | Free-AI analysis with a reliable fallback | Complete |
| 7 | Complaint, routing preview, and citizen-confirmed email workflow | Complete for the hackathon MVP |
| 8 | Public dashboard and persistent status tracking | Complete for the hackathon MVP — location-scoped dashboard, public detail/timelines, moderator-only status updates, community verification signals, and civic/emergency moderation are live |
| 9 | Mobile polish, demo data, testing, and deployment readiness | In progress — responsive refinement and production build checks are complete; final device QA, deployment configuration, and demo rehearsal remain |

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

The service links route to `/report`, `/emergency`, and `/emergency?type=women`, which are now implemented for the hackathon MVP.

### Step 4 delivery notes

The civic reporting workflow now includes:

- A `/report` page with a mobile-friendly civic issue form.
- Natural-language issue description, location/landmark, time or duration, optional positive count of people affected, visual evidence, and extra details.
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
- **Complaint and email drafting:** users can copy a formal complaint, regenerate a new email version, edit the subject/body, receive a source-tracked editable department address where available, and explicitly approve direct sending from the CivicShield Gmail account.

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

The address input provides a short, debounced suggestion list while the user types. The list overlays the map without moving the form layout. Live evidence capture uses the device camera directly: users can choose `Take photo` or `Record video`, rather than only opening the general file picker.

Each generated department email carries the full useful report record: report reference, issue description, confirmed location name, latitude/longitude, duration, optional positive affected-person count, optional extra details, and evidence-file count. The reporter can still edit the final draft before approval.

### Owner Gmail sending (hackathon mode)

To send every confirmed report from the CivicShield project owner’s Gmail account—without asking each citizen to connect Gmail—also set:

```text
GMAIL_REFRESH_TOKEN=your_owner_gmail_refresh_token
```

The direct-send route uses this token server-side to obtain a short-lived Gmail access token. Citizens still must confirm the exact recipient, message, and attachments before sending. Evidence files saved for the report are included as email attachments. After Gmail accepts the message, CivicShield stores the local status as `delivery confirmed` and shows a receipt with the Gmail message ID. This is not a claim that a department has acted on or resolved the issue.

### Government-recipient directory

`src/lib/data/department-directory.json` is the source-tracked recipient directory. It currently contains verified West Bengal pilot contacts for Bidhannagar, Kolkata, and the state Public Works Department. CivicShield matches the confirmed location and routed issue category, then pre-fills a single editable official address. Every record retains its official source URL and last-verification date.

India-wide coverage must be added city-by-city from official municipal or state sources; the app intentionally leaves the recipient blank when there is no verified match rather than guessing an authority address.

### Email boundary

The citizen must still review the recipient and message and check the authorization box before CivicShield sends a message. With `GMAIL_REFRESH_TOKEN`, the project owner Gmail is used; without it, a citizen may connect Gmail for the short access-token lifetime. CivicShield does not claim that a successful send means the authority has acted.

### Current implementation status — 19 July 2026

#### Completed

- Polished landing page with civic-report, emergency-service, women-safety, and live place-safety entry points.
- Location Safety Snapshot on the home page: detects the user's current area, distinguishes a first-time local visit from a repeat visit in this browser, and checks recent nearby civic/emergency signals from the last 24 hours.
- Illustrative home experience with a safety-intelligence story section, abstract city-signal visual, and clear hackathon positioning: whether the user is at home or visiting a new place, CivicShield helps them understand nearby risk and reach support quickly.
- Civic report form with validation, map pinning, current location, address suggestions, readable address + coordinates, image/video selection, and live camera capture.
- Civic report time capture now uses a calendar/date-time picker instead of manual duration typing.
- Groq free-tier analysis with an offline deterministic fallback.
- Structured safety brief, urgency warning, formal complaint, and consistently formatted, editable department email.
- Source-tracked editable government-recipient directory for the current West Bengal pilot locations.
- Gmail owner-account sending after explicit citizen confirmation, evidence attachments, local delivery receipt, and no false "resolved" claim.
- Dedicated `/emergency` route with immediate `Call 112 Now`, quick categories for women safety, fire, medical, live wire, accident, and unsafe area, situation-specific checklists, and a compact emergency record.
- Women-safety mode with nearby police stations, safer public places, direct call links where contact numbers are available, and a quick incident note.
- Google-backed reverse geocoding and place lookup through server routes when `GOOGLE_MAPS_API_KEY` is configured, with OpenStreetMap/Overpass fallback.
- Nearby emergency help cards for police, hospitals, ambulance services, fire stations, and safer public places, including visible phone numbers and `tel:` call buttons when the map provider returns a number.
- Supabase server-side report creation, analysis persistence, delivery-confirmed persistence, and a location-scoped public `/dashboard` feed.
- Public dashboard now requests the user's location and shows complaints around that location, with lodged time, distance, status, and clickable report rows.
- Public report-detail page at `/dashboard/[reportId]` with detailed report text, lodged timestamp, incident time, route, evidence count, public status timeline, and safety analysis.
- Site-wide emergency alert marquee that shows latest nearby lodged emergencies, including women-safety alerts, when emergency reports are persisted.
- Supabase-backed emergency report API and schema for shared emergency alerts, with local emergency-note fallback.
- Responsive visual fixes for map autocomplete stacking and email-send controls.

#### Setup still required before persistent tracking works

- Run `supabase/schema.sql` once in the correct Supabase project’s SQL Editor.
- If the schema was run before emergency alerts were added, run the latest `supabase/schema.sql` again so `emergency_reports` exists.
- Add the same Supabase, Groq, Gmail, and Google environment variables to Vercel before deploying.
- Enable Google **Geocoding API** for readable addresses and Google **Places API / Places API (New)** for nearby stations, hospitals, safer public places, and phone numbers.

#### Remaining before launch

1. **Emergency alert hardening:** tune alert radius, add shared production rate limiting, and decide which emergency details are safe for public display.
2. **Directory expansion:** add verified municipal contacts city-by-city; never guess nationwide recipients.
3. **Deployment readiness:** complete mobile/device QA, verify all Vercel environment variables, carry out a privacy review, seed safe demo reports, and rehearse the hackathon demo.

### Current accountability boundary

Supabase-backed public tracking and moderated accountability are implemented for the hackathon MVP. Raw evidence, private contact details, email recipients, Gmail message IDs, and moderator-only actions remain private. Community verification is an input for moderator review; it does not independently change a public case status.

### Step 8 delivery notes: Supabase persistence and public tracking

- New reports are created through a server-side Supabase route and receive a globally unique `CS-YYYY-XXXXXXXX` public reference.
- AI classification and Gmail delivery-confirmed status are written back to the persistent report record.
- `/dashboard` is now a location-scoped public accountability feed. It requests current browser location, shows complaints near that location, and displays lodged time, workflow status, and distance where available.
- Each dashboard row links to `/dashboard/[reportId]`, a public detail page with report description, incident date/time, public timeline, route, evidence count, and safety analysis. Private evidence files, email addresses, and Gmail message IDs remain hidden.
- `supabase/schema.sql` creates the reports table, immutable status-event table, and emergency-report table. Row Level Security is enabled with no browser policies; only server routes using `SUPABASE_SERVICE_ROLE_KEY` can access the database.
- The report screen fails clearly if database setup is incomplete instead of silently pretending that the report is publicly persisted.

### Step 5 delivery notes: Emergency and women safety

- `/emergency` now prioritizes a large `Call 112 Now` action, then lets the user pick a quick emergency category.
- Supported emergency categories are women safety, fire, medical, live wire, accident, and unsafe area.
- The emergency page requests live location and uses it across safety guidance, nearby help, and the quick incident record.
- Nearby help is dynamic: police stations, hospitals, ambulance services, fire stations, and safer public places are fetched from Google Places when configured, with OpenStreetMap/Overpass fallback.
- Contact numbers and direct `tel:` call buttons are shown when the map provider returns a listed phone number.
- Women-safety mode highlights nearby police stations and safer public places and lets the user lodge a quick women-safety incident.
- Emergency notes are saved to Supabase through `/api/emergency-reports` when configured, and fall back to browser local storage if persistence is unavailable.
- A site-wide emergency alert marquee shows latest nearby lodged emergencies and women-safety alerts.

### Location intelligence delivery notes

- The home page now sells CivicShield as a safety companion for both familiar places and new locations.
- The Location Safety Snapshot shows the user's readable current location first, detects first-time versus repeat visits from this browser, and checks recent nearby civic complaints and emergencies from the last 24 hours.
- If recent signals exist, the snapshot shows counts and recent items for civic complaints, emergencies, and women-safety incidents. If none exist, it shows a positive "good to go" message.
- The public dashboard uses the same location-first idea and adds an illustrative safety-intelligence hero.

#### Activate the database

1. In Supabase, open **SQL Editor** → **New query**.
2. Copy all contents of `supabase/schema.sql`, run it once, and confirm both tables appear in the Table Editor.
3. Restart `npm run dev`, submit a new report, complete its analysis, and open `/dashboard`.

### Latest merge verification — 18 July 2026

After the dashboard and emergency-flow merge, the location-driven dashboard and landing safety snapshot were updated to keep a stable coordinate value inside asynchronous requests. This removes TypeScript nullability failures during the production build.

Verified successfully:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

### Accountability and safety hardening — 18 July 2026

- **Moderator status control:** `/moderator` now has a server-protected login and can publish status updates only through a signed, HTTP-only moderator session. Every moderator update adds an immutable public timeline event.
- **Community verification:** public report pages now allow one browser-scoped `Looks resolved` or `Still a problem` signal. It is stored for moderator review and cannot directly alter a public case status.
- **Privacy boundary:** public report pages now show a safety summary rather than raw citizen prose or extra details. Public locations are reduced to a broader locality and coordinates are rounded before being returned to browser pages.
- **Abuse controls:** report creation, emergency report creation, community verification, and moderator sign-in have server-side, IP-scoped request limits. This lightweight in-memory limit is appropriate for the hackathon demo; a shared rate-limit store is required before a multi-instance production launch.

#### Required setup for moderator controls

Add two server-only random secrets to `.env.local` and Vercel:

```text
MODERATOR_ACCESS_KEY=choose_a_long_private_access_key
MODERATOR_SESSION_SECRET=use_a_different_long_random_secret
```

Run the latest `supabase/schema.sql` in the Supabase SQL Editor again. It adds the `community_verifications` table required for the public verification buttons.

### Moderator review queue — 18 July 2026

After sign-in at `/moderator`, the admin now sees every persisted civic report in newest-first order. Selecting a row reveals the complete private report context, including submitted description, extra details, evidence count, and delivery recipient. The moderator can publish a verified public status update or permanently delete a confirmed false/spam report. Deletion cascades to that report’s public timeline and community-verification records.

The destructive delete action uses a CivicShield in-app confirmation modal rather than a browser alert, with explicit `Keep report` and `Delete permanently` choices.

### Reporting and moderation polish — 19 July 2026

- Empty AI guidance is no longer rendered as a blank `What to do now` card on the report analysis page.
- The moderator queue supports all-time, past 7 days, past 2 weeks, past month, and custom date ranges.
- Moderator city filters are created only from cities represented in saved reports. Kolkata, New Town, Bidhannagar, and Rajarhat reports are grouped as `Kolkata Metropolitan Area` instead of appearing as separate city options.
- The landing navigation and site-wide footer link to `/moderator`. The footer also contains the project team’s email, GitHub, and LinkedIn details.

### Home and feedback enhancements — 19 July 2026

- The homepage now begins with a quick incident-record form and three prominent action paths for civic reports, emergency help, and women safety.
- Quick incident records use the existing protected emergency-report endpoint and are saved to the same tracking system as records raised from `/emergency`.
- A feedback form above the footer delivers messages to both project-team inboxes using the configured CivicShield Gmail sender. It is rate limited and does not expose recipient email addresses in the UI.
- The report page has a clear `Back to home` link above the form, and the moderator custom-date filter now uses an in-app calendar popover.

### Emergency moderation merge — 19 July 2026

- The moderator workspace now has separate **Emergency reports** and **Civic reports** tabs. Emergency records show safety state, location, details, coordinates, and a map link when coordinates are available.
- Civic report moderation retains its city and date-range filters, custom calendar, full private review details, status publishing, and false-report deletion.
- Recent public emergency signals are prioritized for the site alert layer using the configured Groq model when available, with deterministic local safety prioritisation as a fallback.

### Responsive homepage refinement — 19 July 2026

- The homepage quick incident record can now request the device’s current location, resolve it to a readable label, and save its coordinates with the emergency record.
- Homepage action controls, safety snapshot actions, and the feedback form have responsive layouts for narrow mobile screens and larger desktop screens.
- Feedback fields now have labels, accessible focus states, clearer privacy guidance, and a full-width mobile submit action. The shared footer includes a copyright notice.

### Emergency page layout refinement — 19 July 2026

- `/emergency` now presents the quick incident record first, followed by the emergency response controls, nearby help, and the selected safety checklist. The incident form uses a compact responsive layout on mobile and desktop.

### Moderator workflow enhancements — 19 July 2026

- Civic-report details now include a one-click Google Maps location link when coordinates are available.
- Moderators can select multiple civic reports and batch-mark them `in progress` or `department resolved`, or delete the selected reports after an in-app confirmation.
- Emergency reports now support city filtering using only cities represented in stored records. Moderators can select one or many emergency reports and permanently delete false or obsolete records through the same protected confirmation flow.
- Emergency summary metrics use a fixed label area so counts align cleanly across desktop and mobile layouts.

Required environment variables are documented in `.env.example`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GOOGLE_MAPS_API_KEY=
```

## MVP Boundary

The one-day version intentionally excludes authentication, direct official emergency dispatch, real-time maps, and permanent cloud storage. It proves the most valuable user experience first: clear reporting, safer action, structured communication, transparent routing, and community-verified accountability.
