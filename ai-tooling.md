# AI Tooling & Prompt Engineering Summary

## 1. Primary AI Tools Used
* **Cursor AI (IDE):** Primary development environment used for code generation, architectural scaffolding, and real-time debugging.

---

## 2. Initial SRS Scaffolding

### Stack selection
* **Workflow:** Shared the **Software Requirements Specification (SRS)** with Cursor and asked for the simplest efficient stack to meet project requirements.
* **Stack chosen:** React (Vite) + React Router + CSS Flexbox/Grid on the frontend; Flask REST API + SQLAlchemy on the backend; PostgreSQL for persistence.

### Baseline generation
* **Workflow:** Prompted Cursor to scaffold the core project structure directly from the SRS document.
* **Outputs generated:**
  * Frontend directory with Vite config, React Router setup, and all five required pages (Home, Menu, Reservations, About Us, Gallery).
  * Shared components: layout/header, footer, newsletter form, gallery lightbox, and API client helpers.
  * Static content modules for menu items, about copy, gallery data, and contact info.
  * Backend Flask app with SQLAlchemy models (`customers`, `reservations`), CORS, and REST routes.
  * `schema.sql`, `.gitignore`, `.env.example` files, and project README.

### Iteration pattern
* Start with SRS-aligned boilerplate, run locally, then refine UI and fix bugs through follow-up prompts rather than rewriting from scratch.

---

## 3. Core Features Built

### Frontend pages (per SRS)
* **Home** — Hero branding, navigation links, newsletter signup, and editorial highlights.
* **Menu** — Categorized dishes with descriptions and prices from the SRS.
* **Reservations** — Booking form with date/time slot dropdown, guest count, and confirmation feedback.
* **About Us** — Restaurant history, founder profiles, and brand story.
* **Gallery** — Photo grid with lightbox, awards list, and customer reviews.

### Backend API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/newsletter` | Newsletter signup (stores/updates `customers` table) |
| POST | `/api/reservations` | Create reservation with validation and table assignment |

### Reservation logic
* Generates bookable time slots for the next 14 days in **Eastern Time** (`America/New_York`).
* Validates customer name, email format, and guest count (1–12).
* Tracks up to **30 tables** per time slot; returns 409 when a slot is fully booked.
* Assigns a random available table number on successful booking.
* Links reservations to customer records (create or update by email).

### Newsletter logic
* Validates email format on the backend.
* Creates a new customer record or updates an existing one with `newsletter_signup = true`.

### Design system
* **shadcn/ui** with **Sera** preset and **taupe** base color.
* **Tailwind CSS v4** with CSS variables in `index.css`.
* Typography: **Cormorant Garamond** (headings) and **Source Sans 3** (body).

### Developer tooling
* Flask CLI: `init-db`, `migrate-reservation-timezone`.
* Dev-only `CLEAR_DB_ON_START` env flag to reset reservations/customers on backend restart.

---

## 4. Prompt Examples

Effective prompts tended to be **specific about the page, symptom, and desired outcome**. Below are representative examples used during development.

### Scaffolding & architecture
> *"Based on my SRS in [path-to-SRS.pdf], what is the simplest and most efficient stack to get this page going?"*

> *"Yes, scaffold the core structure of this webpage."*

### UI redesign (Shadcn landing page)
> *"I have successfully installed Shadcn with the Sera preset, along with the Button, Card, and Separator components. Please completely redesign our landing page to look like an incredibly premium, high-end Parisian Cafe called 'Cafe Fausse'. Use a gorgeous editorial layout with serif headings, clean product cards for a featured menu section using the UI Card component, elegant spacing, and warm background colors."*

### Visual bug reports
> *"I would like the home page to have a contrasting background to bring out the Cafe Fausse title, otherwise I cannot see it. Also there are issues with the Gallery page, difficult to load and scroll down."*

> *"The reservation confirmed message … is not matching the time stamp from the drop down list for Time slot. Make sure they are matching time zones."*

### Iterative refinement
> *"Make the Book reservation under Reservations needs an outline so it looks like a button … The Home page picture is detracting from the restaurant name, make that part lighter."*

> *"How do I make sure the mobile version of the site has more margin in the view?"* → followed by *"yes apply changes"* once the approach was explained.

> *"The header in mobile portrait view is still too close to the left edge, create an indent so has more margin and is readable."*

### Prompting tips that worked well
* **Name the file or component** when possible (e.g. footer, Reservations page, lightbox).
* **Describe the symptom and expected behavior** for bugs (dropdown says 5 PM, confirmation says 4 AM).
* **Confirm before applying** when exploring options (`yes apply changes`).
* **One focused change per prompt** for layout tweaks (header indent, footer spacing, font consistency).

---

## 5. Key Refinements & Troubleshooting
### Project setup & foundation
* Scaffolded the full stack from the SRS: React (Vite) + React Router frontend, Flask REST API backend, PostgreSQL schema.
* Built all five SRS pages: Home, Menu, Reservations, About Us, Gallery.
* Added shared layout, footer, newsletter form, lightbox, and API client helpers.
* Configured `.gitignore`, env examples, and project README.

### Design system & UI polish
* Integrated **shadcn/ui** with the **Sera** preset and **taupe** base color.
* Set theme fonts: **Cormorant Garamond** (headings) and **Source Sans 3** (body).
* Redesigned the landing page into a premium Parisian editorial layout using Shadcn `Button`, `Card`, and `Separator`.
* Standardized outlined buttons across Home and Reservations.
* Unified footer typography so address, hours, newsletter copy, and form fields share the same font system.
* Tightened footer contact lines (address, phone, hours) by removing extra paragraph spacing.

### Home page refinements
* Fixed hero title legibility with a contrasting white/cream panel over the backdrop image.
* Replaced broken hero image URLs and updated to modern Parisian café / local `public/` images.
* Softened hero overlays so the restaurant name stands out without the photo overpowering it.
* Translated French copy to English and refined tone for French fine dining.
* Updated location text to **Washington, DC · Est. 2010** and tagline to **French Fine Dining**.
* Removed Chef's Selection, duplicate restaurant image, and on-page address/hours blocks.
* Reordered and centered the newsletter section.

### Menu, About, Gallery, Reservations
* Wired `public/` images into Home, Menu, and Gallery via `src/data/images.js`.
* Swapped Menu banner to ribeye image; removed redundant inline steak thumbnails.
* Fixed **About Us** font consistency (serif headings, sans-serif body).
* Fixed **Private Dining** gallery image not loading.
* Fixed Gallery scroll/load issue: Lightbox was locking `body` overflow even when closed.
* Updated gallery content (chef at the pass, dessert/cheesecake, celebration event image).
* Fixed cheesecake cropping with `object-fit: contain`.
* Increased Awards and Customer Reviews typography on Gallery.
* Converted Reservations submit control to a proper outlined Shadcn button.

### Backend & data troubleshooting

#### Reservation timezone synchronization
* **Issue:** The dropdown showed local browser time, but the form sent UTC via `toISOString()`. The backend stripped timezone info, so confirmation messages showed wrong times (e.g. 5:00 PM → 4:00 AM).
* **AI Collaboration:** Used Cursor to trace the full request flow from `Reservations.jsx` through `app.py` to PostgreSQL storage.
* **Resolution:** Standardized frontend and backend on **`America/New_York`** (Washington, DC). Refactored slot generation, parsing, formatting, and API responses to use Eastern wall-clock time. Added `time_slot_display` in API output and a `migrate-reservation-timezone` Flask CLI command for existing databases.

#### Windows timezone data
* **Issue:** `ZoneInfoNotFoundError: 'No time zone found with key America/New_York'` on Windows.
* **Resolution:** Added **`tzdata`** to `backend/requirements.txt` so Python's `zoneinfo` module has IANA timezone data on Windows.

#### Development database reset
* **Issue:** PostgreSQL data persisted across backend restarts, causing stale reservations to block table availability during testing.
* **Resolution:** Added `CLEAR_DB_ON_START=true` env option to wipe reservations and customers on startup during local development.

#### Newsletter & email validation
* Added backend email validation (`EMAIL_PATTERN`) for newsletter and reservation endpoints.

### Mobile & responsive layout
* Increased mobile side margins globally (`.container` padding `1.5rem → 2rem` below 760px).
* Added safe-area inset support for notched phones.
* Updated Home sections to `px-8 md:px-6` for wider mobile margins.
* Added portrait-mobile header indents: extra left spacing for the brand block, extra right spacing for nav links, and further increased header left inset for readability.

---

## 6. Version Control & Local Development
* Configured Git tracking with `.gitignore` for `.env`, `node_modules`, and virtual environments.
* Frontend production build via `npm run build` (output in `frontend/dist/`).
* Application is developed and tested locally with the Vite dev server (`http://localhost:5173`) and Flask API (`http://localhost:5000`).