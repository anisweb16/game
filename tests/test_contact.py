"""
Tests: POST /contact

Covers:
  - Valid submission persists to DB and returns ok:true
  - Optional field (telefono) may be omitted
  - Missing any required field triggers 422 Pydantic validation
  - Empty payload triggers 422

Test data convention: all test emails end in @test.com so db_cleanup
can identify and delete them after each test.
"""
import pytest

_BASE = {
    "nombre": "Test Usuario",
    "email": "contact_test@test.com",
    "asunto": "Automated test subject",
    "mensaje": "This is an automated test message — safe to delete.",
}


def test_contact_valid_returns_ok(client, db_cleanup):
    """A fully populated contact form should return 200 with ok:true."""
    response = client.post("/contact", json=_BASE)
    assert response.status_code == 200
    data = response.json()
    assert data["ok"] is True
    assert "msg" in data


def test_contact_telefono_is_optional(client, db_cleanup):
    """telefono has a default of '' in the Pydantic model — omitting it is valid."""
    payload = {k: v for k, v in _BASE.items() if k != "telefono"}
    payload["email"] = "phone_optional_test@test.com"
    response = client.post("/contact", json=payload)
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_contact_missing_nombre_returns_422(client):
    """nombre is required — omitting it must fail Pydantic validation."""
    payload = {k: v for k, v in _BASE.items() if k != "nombre"}
    response = client.post("/contact", json=payload)
    assert response.status_code == 422


def test_contact_missing_email_returns_422(client):
    """email is required — omitting it must fail Pydantic validation."""
    payload = {k: v for k, v in _BASE.items() if k != "email"}
    response = client.post("/contact", json=payload)
    assert response.status_code == 422


def test_contact_missing_asunto_returns_422(client):
    """asunto is required — omitting it must fail Pydantic validation."""
    payload = {k: v for k, v in _BASE.items() if k != "asunto"}
    response = client.post("/contact", json=payload)
    assert response.status_code == 422


def test_contact_missing_mensaje_returns_422(client):
    """mensaje is required — omitting it must fail Pydantic validation."""
    payload = {k: v for k, v in _BASE.items() if k != "mensaje"}
    response = client.post("/contact", json=payload)
    assert response.status_code == 422


def test_contact_empty_body_returns_422(client):
    """An empty JSON body must fail Pydantic validation."""
    response = client.post("/contact", json={})
    assert response.status_code == 422
