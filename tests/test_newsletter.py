"""
Tests: POST /newsletter

Covers:
  - New email subscription returns ok:true
  - Duplicate subscription is idempotent (INSERT IGNORE — no error, no duplicate row)
  - Missing email field triggers 422 Pydantic validation
  - Empty payload triggers 422

Test data convention: all test emails end in @test.com so db_cleanup
can identify and delete them after each test.
"""

_TEST_EMAIL = "newsletter_test@test.com"


def test_newsletter_new_email_returns_ok(client, db_cleanup):
    """A new email address should be accepted and return ok:true."""
    response = client.post("/newsletter", json={"email": _TEST_EMAIL})
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "msg" in data


def test_newsletter_duplicate_email_is_idempotent(client, db_cleanup):
    """
    Subscribing the same email twice must not raise an error.
    The endpoint uses INSERT IGNORE, so the second call is a no-op.
    Both calls should return 200 ok:true.
    """
    first = client.post("/newsletter", json={"email": _TEST_EMAIL})
    second = client.post("/newsletter", json={"email": _TEST_EMAIL})

    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["ok"] is True
    assert second.json()["ok"] is True


def test_newsletter_missing_email_field_returns_422(client):
    """email is the only field and it's required — omitting it must fail."""
    response = client.post("/newsletter", json={})
    assert response.status_code == 422


def test_newsletter_null_email_returns_422(client):
    """email: null must fail Pydantic validation (str is required)."""
    response = client.post("/newsletter", json={"email": None})
    assert response.status_code == 422
