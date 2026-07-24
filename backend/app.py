import os
import random
import re
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import func, text

from models import (
    TOTAL_TABLES,
    Customer,
    Reservation,
    RESTAURANT_TZ,
    db,
    format_eastern_time_slot,
    to_eastern_naive,
)

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/cafe_fausse",
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

_cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
CORS(app, origins=_cors_origins)

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def parse_time_slot(value):
    if not value:
        return None

    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except (TypeError, ValueError, AttributeError):
        return None

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=RESTAURANT_TZ)
    else:
        parsed = parsed.astimezone(RESTAURANT_TZ)

    return to_eastern_naive(parsed)


def format_time_slot(time_slot):
    return format_eastern_time_slot(time_slot)

def get_or_create_customer(name, email, phone=None, newsletter=False):
    customer = Customer.query.filter_by(email_address=email).first()
    if customer:
        customer.customer_name = name
        if phone:
            customer.phone_number = phone
        if newsletter:
            customer.newsletter_signup = True
        return customer

    customer = Customer(
        customer_name=name,
        email_address=email,
        phone_number=phone,
        newsletter_signup=newsletter,
    )
    db.session.add(customer)
    return customer


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/api/newsletter", methods=["POST"])
def newsletter_signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "Newsletter Subscriber").strip()

    if not EMAIL_PATTERN.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400

    customer = Customer.query.filter_by(email_address=email).first()
    if customer:
        customer.newsletter_signup = True
        if name and name != "Newsletter Subscriber":
            customer.customer_name = name
    else:
        customer = Customer(
            customer_name=name,
            email_address=email,
            newsletter_signup=True,
        )
        db.session.add(customer)

    db.session.commit()
    return jsonify({"message": "Thank you for subscribing to our newsletter!"})


@app.route("/api/reservations", methods=["POST"])
def create_reservation():
    data = request.get_json(silent=True) or {}

    time_slot = parse_time_slot(data.get("time_slot"))
    guest_count = data.get("number_of_guests")
    name = (data.get("customer_name") or "").strip()
    email = (data.get("email_address") or "").strip().lower()
    phone = (data.get("phone_number") or "").strip() or None

    if not time_slot:
        return jsonify({"error": "Please select a valid date and time."}), 400
    if not name:
        return jsonify({"error": "Customer name is required."}), 400
    if not EMAIL_PATTERN.match(email):
        return jsonify({"error": "Please enter a valid email address."}), 400
    try:
        guest_count = int(guest_count)
    except (TypeError, ValueError):
        return jsonify({"error": "Number of guests must be a valid number."}), 400
    if guest_count < 1 or guest_count > 12:
        return jsonify({"error": "Number of guests must be between 1 and 12."}), 400

    booked_tables = {
        row.table_number
        for row in Reservation.query.filter(
            func.date_trunc("minute", Reservation.time_slot) == func.date_trunc("minute", time_slot)
        ).all()
    }

    if len(booked_tables) >= TOTAL_TABLES:
        return jsonify({"error": "This time slot is fully booked. Please choose another time."}), 409

    available_tables = [table for table in range(1, TOTAL_TABLES + 1) if table not in booked_tables]
    table_number = random.choice(available_tables)

    customer = get_or_create_customer(name, email, phone=phone)
    db.session.flush()

    reservation = Reservation(
        customer_id=customer.customer_id,
        time_slot=time_slot,
        table_number=table_number,
    )
    db.session.add(reservation)
    db.session.commit()

    return jsonify(
        {
            "message": f"Reservation confirmed for {format_time_slot(time_slot)}.",
            "reservation": reservation.to_dict(),
            "table_number": table_number,
        }
    ), 201


def reset_database():
    """Clear all reservations and customers. Intended for local development."""
    Reservation.query.delete()
    Customer.query.delete()
    db.session.commit()
    print("Database cleared.")


@app.cli.command("init-db")
def init_db():
    db.create_all()
    print("Database tables created.")


@app.cli.command("migrate-reservation-timezone")
def migrate_reservation_timezone():
    """Store reservation times as Eastern wall-clock values in the database."""
    column = db.session.execute(
        text(
            "SELECT data_type, udt_name FROM information_schema.columns "
            "WHERE table_name = 'reservations' AND column_name = 'time_slot'"
        )
    ).fetchone()

    if not column:
        print("reservations.time_slot column not found.")
        return

    if column.udt_name != "timestamptz":
        print("reservations.time_slot already stores Eastern wall-clock time.")
        return

    db.session.execute(
        text(
            "ALTER TABLE reservations "
            "ALTER COLUMN time_slot TYPE TIMESTAMP WITHOUT TIME ZONE "
            "USING time_slot AT TIME ZONE 'America/New_York'"
        )
    )
    db.session.commit()
    print("Migrated reservations.time_slot to Eastern wall-clock storage.")


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        if os.getenv("CLEAR_DB_ON_START", "").lower() in ("1", "true", "yes"):
            reset_database()
    app.run(debug=True, port=int(os.getenv("PORT", 5000)))
