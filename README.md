# Magnolia — Premium Tier Booking Widget Prototype

Magnolia is the premium tier of the RIVR booking widget for med spas.
It's a frontend-only prototype (Vite + React + Tailwind) intended to be
embedded as an iframe on a marketing site.

This is a **prototype**: no real backend, payments, calendars, or emails.
All interactions are simulated client-side with mock data.

---

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Build the static site to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run docker:build` | Build the production container image |
| `npm run docker:run` | Run the container locally on port 8080 |

---

## Local container test

```bash
npm run docker:build
npm run docker:run
# open http://localhost:8080
```

The Nginx config in the image:
- Listens on `$PORT` (defaults to `8080`)
- Sets `Content-Security-Policy: frame-ancestors *;` so the page can be
  embedded in any iframe
- Sends `Referrer-Policy: strict-origin-when-cross-origin`
- Gzips HTML / CSS / JS / SVG / JSON
- Caches `/assets/*` for 1 year (`immutable`); `index.html` is always no-cache
- Falls back to `/index.html` for SPA routes
- Runs as a non-root user

---

## Deploy to Cloud Run — manual

```bash
PROJECT_ID=your-gcp-project
SERVICE_NAME=magnolia-prototype
REGION=us-central1

gcloud builds submit --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME"

gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --memory 256Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --timeout 60s \
  --port 8080
```

## Deploy to Cloud Run — Cloud Build

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_SERVICE_NAME=magnolia-prototype,_REGION=us-central1 .
```

Recommended Cloud Run settings:

| Setting | Value |
| --- | --- |
| Memory | 256 Mi |
| CPU | 1 |
| Min instances | 0 |
| Max instances | 10 |
| Concurrency | 80 |
| Timeout | 60s |
| Authentication | Allow unauthenticated |

---

## Embedding

Drop the deployed URL into an iframe:

```html
<iframe
  src="https://magnolia-prototype-xxx.a.run.app/"
  width="440"
  height="780"
  style="border:0;"
  title="Magnolia booking widget"
></iframe>
```

Body and root backgrounds are transparent so the widget bleeds into the
host page; the widget card itself keeps its own white background and
shadow. The widget locks to a ~420px max width at every viewport.

---

## Project structure

```
src/
  App.jsx                        # step router
  main.jsx                       # React entry
  index.css                      # global Tailwind + font setup
  mockData.js                    # services, packages, practitioners
  state/
    BookingContext.jsx           # Context + actions, sessionStorage hydration
    reducer.js                   # useReducer + step constants
  utils/
    availability.js              # deterministic per-practitioner availability
    formatting.js                # phone, email, DOB, card formatters
    ics.js                       # single + multi-event .ics generation
    storage.js                   # sessionStorage with try/catch fallback
  components/
    Banner.jsx                   # Magnolia tier banner
    Footer.jsx                   # Powered by RIVR + HIPAA line
    ProgressBar.jsx              # dynamic, non-clickable progress
    Button.jsx                   # primary / ghost / back
    SelectCard.jsx               # single-click select tile
    Calendar.jsx                 # month grid + slot picker
    Avatar.jsx                   # initials avatar (no real photos)
    EmailPreview.jsx             # email mockup chrome
    ConfirmDialog.jsx            # change-confirmation modal
    ScreenChrome.jsx             # screen header + back-button frame
  screens/
    BookingTypeScreen.jsx        # step 1 — Consult / Single / Series
    ServiceSelectScreen.jsx      # step 2 — search + collapsible categories OR series
    ReturningPatientScreen.jsx   # step 3 — gate (conditional)
    ConsultFormatScreen.jsx      # step 4 — virtual / in-person (conditional)
    PractitionerScreen.jsx       # step 5 — pick provider (or First available)
    CalendarScreen.jsx           # step 6 — single-appointment calendar
    SeriesFirstScreen.jsx        # step 6a — series session 1
    SeriesScheduleScreen.jsx     # step 6b — smart-spacing suggestions
    SeriesReviewScreen.jsx       # step 6c — full series review
    SameDayScreen.jsx            # step 7 — same-day procedure (conditional)
    IntakeScreen.jsx             # step 8 — patient details
    PolicyScreen.jsx             # step 9 — cancellation / deposit / series policy
    CheckoutScreen.jsx           # step 10 — Stripe-styled mock checkout
    ConfirmationScreen.jsx       # step 11 — success + .ics + email previews
```

Deployment files at the project root:

```
Dockerfile
nginx.conf
docker-entrypoint.sh
.dockerignore
.gcloudignore
cloudbuild.yaml
```

---

## What's mocked

- Availability is generated deterministically per session (seeded into
  `sessionStorage`) so navigating back/forward doesn't shuffle slots.
- Each practitioner has a distinct working pattern so calendars look
  meaningfully different per provider.
- Stripe-styled checkout is purely visual — no SDK loaded, no network
  calls. The fake `4242…` card is suggested in the UI.
- Emails are rendered as on-screen mockups with full From/To/Subject
  chrome.
- `.ics` files download via a Blob URL: a single `VEVENT` for
  single appointments, multiple `VEVENT`s in one file for series.

## Out of scope (intentionally)

No patient login, complimentary discounts, waitlist, gift cards,
body-map selectors, or photo uploads. Magnolia is a sales showcase.
