from datetime import datetime
from zoneinfo import ZoneInfo

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

RESTAURANT_TZ = ZoneInfo("America/New_York")
RESTAURANT_TZ_NAME = "America/New_York"


def as_eastern(dt):
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=RESTAURANT_TZ)
    return dt.astimezone(RESTAURANT_TZ)


def to_eastern_naive(dt):
    """Return Eastern wall-clock time without timezone info for DB storage."""
    return as_eastern(dt).replace(tzinfo=None)


def format_eastern_time_slot(dt):
    return as_eastern(dt).strftime("%B %d, %Y at %I:%M %p %Z")

TOTAL_TABLES = 30


class Customer(db.Model):
    __tablename__ = "customers"

    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(120), nullable=False)
    email_address = db.Column(db.String(255), nullable=False, unique=True)
    phone_number = db.Column(db.String(30), nullable=True)
    newsletter_signup = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    reservations = db.relationship("Reservation", back_populates="customer", lazy=True)

    def to_dict(self):
        return {
            "customer_id": self.customer_id,
            "customer_name": self.customer_name,
            "email_address": self.email_address,
            "phone_number": self.phone_number,
            "newsletter_signup": self.newsletter_signup,
        }


class Reservation(db.Model):
    __tablename__ = "reservations"

    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("customers.customer_id"), nullable=False)
    time_slot = db.Column(db.DateTime, nullable=False, index=True)
    table_number = db.Column(db.Integer, nullable=False)

    customer = db.relationship("Customer", back_populates="reservations")

    __table_args__ = (
        db.UniqueConstraint("time_slot", "table_number", name="uq_reservation_slot_table"),
    )

    def to_dict(self):
        eastern = as_eastern(self.time_slot)
        return {
            "reservation_id": self.reservation_id,
            "customer_id": self.customer_id,
            "time_slot": eastern.isoformat(),
            "time_slot_display": format_eastern_time_slot(self.time_slot),
            "time_zone": RESTAURANT_TZ_NAME,
            "table_number": self.table_number,
        }
