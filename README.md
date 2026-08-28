# HemoLink — Blood Bank Management System

HemoLink is a front-end concept for a cloud-based Blood Bank Management
System. It connects blood donors, blood banks, and healthcare facilities
through a single, easy-to-use platform — helping manage donor registration,
blood inventory, and emergency requests.

This is a **static front-end project**: plain HTML, CSS, and JavaScript,
with no build tools, frameworks, or backend server. Everything runs
directly in the browser.

## Pages

| Page | Description |
|---|---|
| [`index.html`](index.html) | Landing page — hero, live donor/hospital statistics, About, Features, How It Works, Why Donate, Blood Facts, Testimonials, FAQ, and Footer. |
| [`register.html`](register.html) | Donor sign-up form (personal details, blood group, account security) plus a live webcam face scan, then hands off to OTP verification. |
| [`otp.html`](otp.html) | 6-digit one-time code verification that completes registration. |
| [`login.html`](login.html) | Email/password login, with an optional face-scan step that compares against the photo saved at registration. |

## Features

- Responsive layout for desktop, tablet, and mobile, with a hamburger menu on smaller screens.
- Animated statistics counters that count up when scrolled into view.
- An accordion-style FAQ section.
- A "Login" popover in the header offering "Already have an account?" / "Want to create an account?".
- A full registration → OTP verification → login flow, including a live webcam face-capture step.

## Getting started

Because the pages use `fetch`-like relative links and (on the register/login
pages) camera access, they should be served over `http://` rather than
opened directly as `file://`. Any static file server works, for example:

```bash
# from the project folder
python -m http.server 8000
```

Then open `http://localhost:8000/index.html` in your browser.

## Tech stack

- HTML5 / CSS3 (no preprocessor, no framework)
- Vanilla JavaScript (no build step, no npm dependencies)
- [Font Awesome](https://fontawesome.com/) (icons, via CDN)
- [Google Fonts – Poppins](https://fonts.google.com/specimen/Poppins) (via CDN)

## Files

Every page pulls in the same [`style.css`](style.css) and Google Fonts /
Font Awesome CDN links, then loads only the JavaScript files it actually
needs.

### `index.html`

The landing page, and the only page with the full site navigation. Sections,
top to bottom:

- **Header/nav** — logo, the full desktop link list (`.nav-links`: Home,
  About, Features, How It Works, Blood Facts, Testimonials, FAQs, Contact),
  a **Login button** that opens a small popover ("Already have an
  account?" → `login.html`, "Want to create an account?" → `register.html`),
  and a hamburger icon that only appears below the nav breakpoint and opens
  the mobile dropdown menu (`#dropdownMenu`) containing the same links.
- **Hero** (`#home`) — headline, intro paragraph, "Donate Blood" / "Learn
  More" buttons, hero image.
- **Statistics** — four stat cards (registered donors, partner hospitals,
  blood units, emergency requests) whose numbers count up from 0 when
  scrolled into view (handled by `script.js`).
- **About** (`#about`) — description of HemoLink plus a short feature list.
- **Features** (`#features`) — a 6-card grid of platform features (donor
  registration, blood inventory, emergency requests, appointment booking,
  reports, secure access).
- **How It Works** (`#how`) — a 4-step process (Register → Health
  Screening → Donate Blood → Emergency Response), each with a photo.
- **Why Donate Blood** — an image with a "Every Donation Matters" badge,
  next to four reasons to donate.
- **Blood Facts** (`#blood-facts`) — four short educational fact cards.
- **Testimonials** (`#testimonials`) — three donor/partner quotes with
  star ratings and avatar initials.
- **FAQ** (`#faq`) — six question/answer pairs in an accordion (handled by
  `script.js`).
- **Footer** (`id="contact"`) — brand blurb + social links, Quick Links,
  Support links, and contact details (address/phone/email). This is also
  the scroll target for the header's "Contact" link.

Loads `script.js` only.

### `register.html`

The donor sign-up page. Uses a simplified header (logo + "Back to Home"
only — no full nav). Structure:

- **Personal Information** — full name, email, phone, date of birth, age,
  gender, blood group, weight, address.
- **Account Security** — password + confirm password (live "passwords
  don't match" validation).
- **Face Verification** — a circular webcam preview with "Start Camera" /
  "Scan Face" / "Retake" controls and an animated scan-line effect while
  "scanning."
- A terms checkbox and a **Proceed** button, disabled until the form is
  valid, the passwords match, and a face photo has been captured.

On submit, it generates a 6-digit code, saves it (and the entered email) to
`localStorage`, and redirects to `otp.html`.

Loads `face-scan.js` then `register.js`.

### `login.html`

The login page, using the same simplified header and card layout as
`register.html` (`.auth-container`, a narrower variant of the register
card). Structure:

- **Email / Password** fields, with a "Forgot password?" link (placeholder)
  next to the Password label.
- **Face Verification** — the same camera UI as the register page. If a
  face was previously captured on this browser during registration, the
  freshly-scanned photo is compared against it (see `face-scan.js`) and a
  match/no-match message is shown. This step is optional and never blocks
  login.
- A "Keep me logged in" checkbox and a **Login** button (there's no real
  account check — any validly-formatted email + 8+ character password
  succeeds).
- A link to `register.html` for people without an account.

Loads `face-scan.js` then `login.js`.

### `otp.html`

The one-time-code verification step reached from `register.html`. Shows:

- A "Demo mode" banner explaining there's no real email/SMS service, with
  the actual generated code displayed inline (read from `localStorage`, set
  by `register.js`).
- Six single-digit boxes with auto-advance-on-type, backspace-to-go-back,
  and paste-to-fill-all behavior.
- A **Verify Code** button and a **Resend code** link (generates a fresh
  demo code).
- A success panel shown once the entered code matches.

Loads `otp.js` only.

### `style.css`

One shared stylesheet for all four pages, organized top-to-bottom to match
`index.html`'s section order, followed by the auth pages and then
responsive breakpoints:

`GENERAL SETTINGS` → `NAVIGATION BAR` (incl. nav links, login popover,
hamburger, dropdown menu) → `HERO SECTION` → `STATISTICS SECTION` →
`ABOUT SECTION` → `FEATURES SECTION` → `HOW IT WORKS` → `WHY DONATE BLOOD`
→ `BLOOD FACTS` → `TESTIMONIALS` → `FAQ` → `FOOTER` → `REGISTER PAGE`
(shared by register/login/otp — form fields, the face-scan circle and scan
animation, the OTP boxes, auth-page success panels) → `RESPONSIVE DESIGN`
(all breakpoints, from ~1200px tablets down to ~480px phones).

### `script.js`

Runs on `index.html` only. Four independent pieces:

1. **Hamburger dropdown menu** — `toggleMenu()` toggles `#dropdownMenu`;
   also closes it on an outside click or when a link inside it is clicked.
2. **Login popover** — `toggleLoginMenu()` toggles `#loginMenu` (called
   from the Login button's `onclick`); same outside-click/link-click
   closing behavior.
3. **Statistics count-up** — `initStatCounters()` reads each stat card's
   target number, resets it to 0, then uses an `IntersectionObserver` to
   trigger `animateStatNumber()` (an eased `requestAnimationFrame` loop)
   the first time each card scrolls into view.
4. **FAQ accordion** — `initFaqAccordion()` wires each `.faq-question` to
   toggle its own `.faq-item.active` class while closing any other open
   item, producing single-open-at-a-time behavior.

### `register.js`

Runs on `register.html`. Sets up the face-scan controls via
`initFaceScan()` (from `face-scan.js`), tracking whether a face has been
captured. Handles live validation (`updateProceedState()` re-checks form
validity, face-captured state, and password match on every input/change to
enable/disable the Proceed button and update the hint text). On successful
submit: stops the camera, generates a 6-digit OTP, stores it plus the
email in `localStorage`, saves the captured face photo and name to
`localStorage` (`hemolink_registered_face` / `hemolink_registered_name`)
for the login page to compare against later, and redirects to `otp.html`.

### `login.js`

Runs on `login.html`. Handles the login form's submit (basic validity
check, then shows the success panel — there's no real credential check).
Separately sets up its own `initFaceScan()` instance; when a face is
captured, `compareAgainstRegisteredFace()` reads the photo saved by
`register.js` out of `localStorage` and calls `compareFaceImages()` (from
`face-scan.js`), then displays a color-coded result (matched / not
confidently matched / no registered face found on this device).

### `otp.js`

Runs on `otp.html`. Reads the pending email and code out of `localStorage`
and displays them. Wires up the six digit boxes (auto-advance, backspace,
paste-splitting) and the resend link (generates and stores a new code).
On submit, compares the entered 6 digits against the stored code — correct
clears the pending code, marks `hemolink_verified` in `localStorage`, and
shows the success panel; incorrect shows an inline error and lets the user
retry.

### `face-scan.js`

Shared by `register.js` and `login.js` so the camera logic only exists once.

- **`initFaceScan(elements, callbacks)`** — wires up a set of DOM elements
  (video, captured-image, frame, status text, and the three buttons) into
  a full Start Camera → live preview → Scan Face (with a scan-line
  animation) → capture-to-canvas → Retake flow. Calls `onCaptured(dataUrl)`
  once a photo is captured and `onRetake()` when the user retakes it.
  Returns a `{ stop }` handle so the calling page can release the camera
  (e.g. on form submit).
- **`compareFaceImages(dataUrlA, dataUrlB)`** — a lightweight, real (not
  faked) similarity check: downsamples both images to a 32×32 grayscale
  grid and returns a 0–1 similarity score based on average pixel
  difference. This is **not** a trained face-recognition model — see the
  Limitations section below.

### `favicon.svg`

The browser-tab icon: a single droplet shape filled with the site's brand
red (`#c1121f`), matching the droplet icon used in the header logo.

### `IMG/`

Stock photography used throughout `index.html` (hero, About, the four
How-It-Works steps, the Why-Donate section). Most of the actively-used
images live in `IMG/KAY/`; a few files directly under `IMG/` are unused
leftovers from earlier drafts.

## Important limitations (read before relying on this for anything real)

This project is a front-end demo/prototype. A few things are simulated
rather than fully real:

- **No backend.** There is no server, database, or real user-account
  system. Registration, login, and OTP verification all run entirely in
  the browser.
- **Face "recognition" is not biometric authentication.** `face-scan.js`
  captures a real photo from your webcam, but the login page's face check
  is a basic client-side image-similarity comparison (downsampled
  grayscale pixel difference) — not a trained facial-recognition model. It
  is intentionally **non-blocking**: login always still works with your
  password, whether or not the face scan "matches."
- **The registered face photo is stored in this browser's `localStorage`
  only.** It will not be available on a different device or browser, and
  clearing site data will remove it.
- **OTP codes aren't emailed or texted.** Since there's no email/SMS
  service connected, `otp.html` displays the generated code directly on
  the page in a labeled "Demo mode" banner so the flow can actually be
  completed and tested.
- **Most call-to-action links are placeholders** (`href="#"`) — e.g.
  "Forgot password?", social icons, and several footer links — since
  their destinations don't exist yet.

## Design

- Primary color: `#c1121f` (HemoLink red)
- Font: [Poppins](https://fonts.google.com/specimen/Poppins)
- Icons: Font Awesome 6 (Free)
