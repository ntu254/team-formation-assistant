"""Database engine/session + tables (SQLAlchemy 2.0). Free/OSS; local by default.

DATABASE_URL selects the backend. Default is a local SQLite file for dev; production points
this at a free-tier Postgres (Neon / Supabase) — the repository code is unchanged, only the
URL differs. Student PII therefore stays on infra we control (docs/architecture.md).
"""
from __future__ import annotations

import os

from sqlalchemy import String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./tfa.db")


class Base(DeclarativeBase):
    pass


class CohortRow(Base):
    __tablename__ = "cohorts"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    owner_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String, default="")


def make_engine(url: str | None = None):
    return create_engine(url or DATABASE_URL, future=True)


def make_session_factory(engine):
    return sessionmaker(bind=engine, expire_on_commit=False, future=True)


def init_db(engine) -> None:
    Base.metadata.create_all(engine)
