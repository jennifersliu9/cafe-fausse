# Café Fausse

A full-stack restaurant website for **Café Fausse**, a French fine dining restaurant in Washington, DC. The application was built to meet the project Software Requirements Specification (SRS) and provides a public-facing site for menu browsing, table reservations, newsletter signups, and restaurant information.

## Solution Overview

The project is a **decoupled full-stack web application**:

| Layer | Technology | Role |
|-------|------------|------|
| Frontend | React 19, Vite, React Router | Multi-page SPA with responsive layout |
| Styling | Tailwind CSS v4, shadcn/ui (Sera) | Premium editorial UI with reusable components |
| Backend | Flask, SQLAlchemy, Flask-CORS | REST API for newsletter and reservations |
| Database | PostgreSQL | Persistent storage for customers and reservations |

### Key features

- **Five public pages:** Home, Menu, Reservations, About Us, and Gallery
- **Newsletter signup** — validates email and stores subscribers in the `customers` table
- **Online reservations** — time-slot selection, guest validation (1–12), availability checks, and random table assignment (tables 1–30)
- **Gallery lightbox** — expandable photo grid with awards and customer reviews
- **Shared layout** — sticky header navigation and site-wide footer with contact info

All reservation times use **Eastern Time** (`America/New_York`) so dropdown labels and confirmation messages stay consistent.

---

## Design

The site uses a warm, editorial aesthetic suited to a high-end French restaurant.

### Visual system

- **UI framework:** [shadcn/ui](https://ui.shadcn.com/) with the **Sera** preset and **taupe** base color
- **Typography:** Cormorant Garamond (headings) and Source Sans 3 (body), loaded via Google Fonts
- **Palette:** Soft paper background, charcoal text, muted taupe accents, and crisp thin borders
- **Components:** Shadcn `Button`, `Card`, and `Separator` on the Home page; custom CSS for legacy page layouts

### Layout approach

- **Flexbox and CSS Grid** for page structure, navigation, menu categories, gallery grid, and footer columns
- **Responsive breakpoints** at 760px and 900px for mobile-friendly spacing and stacked layouts
- **Mobile portrait refinements** — increased side margins, safe-area inset support, and header indents for readability on small screens

### Page design

| Page | Highlights |
|------|------------|
| **Home** | Full-bleed hero with cream title panel, explore cards, centered newsletter |
| **Menu** | Categorized SRS menu items with hero banner image |
| **Reservations** | Form with Eastern Time slot dropdown and outlined submit button |
| **About Us** | Founder profiles and restaurant history |
| **Gallery** | Photo grid with lightbox, awards, and reviews |

Images in `frontend/public/` are used for the hero, menu banner, and gallery where applicable.

---

## Project Structure

```
Web Application & Interface Design Project/
├── frontend/              # React (Vite) SPA
│   ├── public/            # Static images (hero, gallery, menu)
│   └── src/
│       ├── pages/         # Home, Menu, Reservations, About, Gallery
│       ├── components/    # Layout, Footer, NewsletterForm, Lightbox, UI
│       ├── data/          # Menu, contact, gallery, about content
│       └── api/           # Fetch helpers for Flask API
├── backend/               # Flask REST API
│   ├── app.py             # Routes, validation, reservation logic
│   └── models.py          # Customer and Reservation models
├── schema.sql             # PostgreSQL table definitions
├── ai-tooling.md          # AI-assisted development summary
└── README.md
```

---

## Run Locally

### Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **PostgreSQL** 14+

### 1. Database

Create the database:

```sql
CREATE DATABASE cafe_fausse;
```

Optionally apply the schema (Flask can also auto-create tables on startup):

```bash
psql -U postgres -d cafe_fausse -f schema.sql
```

### 2. Backend

```bash
cd backend
python -m venv .venv
```

**Windows (PowerShell):**

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

**macOS / Linux:**

```bash
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env` with your PostgreSQL credentials if needed:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cafe_fausse
CORS_ORIGINS=http://localhost:5173
PORT=5000
CLEAR_DB_ON_START=false
```

Set `CLEAR_DB_ON_START=true` during development if you want reservations and customers wiped on each backend restart.

Start the API:

```bash
python app.py
```

The API runs at **http://localhost:5000**.

### 3. Frontend

In a **second terminal**:

```bash
cd frontend
npm install
```

**Windows:**

```powershell
copy .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

The default frontend env points to the local API:

```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

The site runs at **http://localhost:5173**.

### 4. Verify

1. Open **http://localhost:5173** in your browser.
2. Confirm the API is up: **http://localhost:5000/api/health** should return `{"status":"ok"}`.
3. Test a newsletter signup and a reservation from the site.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/newsletter` | Newsletter signup (`email`, optional `name`) |
| POST | `/api/reservations` | Create reservation (`customer_name`, `email_address`, `time_slot`, `number_of_guests`, optional `phone_number`) |

---

## Development Notes

- A time slot is full when all **30 tables** are booked for that minute.
- Newsletter emails are stored in the `customers` table; existing emails are updated rather than duplicated.
- Flask CLI commands: `flask --app app init-db`, `flask --app app migrate-reservation-timezone`
- See `ai-tooling.md` for AI-assisted development, prompt examples, and troubleshooting history.

---

## Production Build

```bash
cd frontend
npm run build
```

Serve the `frontend/dist` folder with a static host (e.g. Vercel). Deploy the Flask API and PostgreSQL separately, and set production env vars (`DATABASE_URL`, `CORS_ORIGINS`, `VITE_API_URL`).
