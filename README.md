# Café Fausse

Full-stack restaurant website for Café Fausse, built per the project SRS:

- **Frontend:** React (Vite) + React Router + CSS Flexbox/Grid
- **Backend:** Flask REST API
- **Database:** PostgreSQL

## Project Structure

```
cafe-fausse/
├── frontend/          # React app
├── backend/           # Flask API
├── schema.sql         # PostgreSQL tables
└── README.md
```

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

## Database Setup

1. Create a database:

```sql
CREATE DATABASE cafe_fausse;
```

2. Apply the schema (optional if using Flask auto-create):

```bash
psql -U postgres -d cafe_fausse -f schema.sql
```

## Backend Setup

```bash
cd backend
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
copy .env.example .env
```

Update `.env` with your PostgreSQL credentials if needed.

Run the API:

```bash
python app.py
```

The API starts at `http://localhost:5000`.

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/newsletter` | Newsletter signup |
| POST | `/api/reservations` | Create reservation |

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The site runs at `http://localhost:5173`.

## Pages

- **Home** — branding, contact info, hours, navigation, newsletter
- **Menu** — categorized menu with SRS items and prices
- **Reservations** — booking form with availability checks
- **About Us** — history, founders, commitments
- **Gallery** — images, lightbox, awards, and reviews

## Development Notes

- Reservations assign a random available table (1–30) per time slot.
- A slot is considered full when all 30 tables are booked.
- Newsletter emails are stored in the `customers` table.
- Gallery images use Unsplash placeholders for development.

## Production Build

```bash
cd frontend
npm run build
```

Serve the `frontend/dist` folder with any static host and deploy the Flask API separately with your managed PostgreSQL instance.
