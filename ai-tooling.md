# AI Tooling & Prompt Engineering Summary

## Primary AI Tools Used
* **Cursor AI (IDE):** Primary development environment used for code generation, architectural scaffolding, and real-time debugging.

---

## 1. Initial Project Scaffolding
* **Workflow:** Leveraged Cursor AI by feeding in the **Software Requirements Specification (SRS)** document to generate the baseline directory structures and boilerplate code.
* **Outputs Generated:**
  * Initial React components and navigation layout.
  * Flask API routing templates and SQLAlchemy database model declarations.

---

## 2. Key Refinements & Troubleshooting
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

## 3. Deployment Pipeline
* Assisted in configuring Git tracking (ignoring `.env` and `node_modules`) and verifying Vercel deployment triggers via GitHub webhooks.