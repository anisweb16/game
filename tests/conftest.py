"""
Shared fixtures and helpers for the GameXStore test suite.

Run from project root:
    pytest -v
    pytest --cov=main --cov-report=term-missing
"""
import os
import pytest
import mysql.connector
from fastapi.testclient import TestClient
from dotenv import load_dotenv

# Load .env before importing main so DB_* and GEMINI_API_KEY are set
load_dotenv()

from main import app  # noqa: E402 — must come after load_dotenv()


# ── Fixtures ──────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def client() -> TestClient:
    """FastAPI test client, reused for the whole session."""
    with TestClient(app) as c:
        yield c


def _get_db_conn():
    """Return a MySQL connection or None if the DB is unreachable."""
    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
        )
    except Exception:
        return None


@pytest.fixture(autouse=False)
def db_cleanup():
    """
    Delete test-generated rows after each test that requests this fixture.
    Uses the '@test.com' email convention to identify test data.
    Safe to use even if the tables don't yet exist (errors are swallowed).
    """
    yield
    conn = _get_db_conn()
    if conn is None:
        return
    try:
        cursor = conn.cursor()
        for table in ("contactos", "newsletter"):
            try:
                cursor.execute(
                    f"DELETE FROM {table} WHERE email LIKE %s",  # noqa: S608
                    ("%@test.com",),
                )
            except mysql.connector.Error:
                pass  # table may not exist yet
        conn.commit()
    finally:
        conn.close()


# ── Skip markers ──────────────────────────────────────────────────────────────

def pytest_configure(config):
    config.addinivalue_line(
        "markers",
        "needs_gemini: skip when GEMINI_API_KEY is not set in the environment",
    )


def pytest_runtest_setup(item):
    if item.get_closest_marker("needs_gemini") and not os.getenv("GEMINI_API_KEY"):
        pytest.skip("GEMINI_API_KEY not set — skipping live Gemini test")
