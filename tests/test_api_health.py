"""
Tests: FastAPI auto-generated docs and OpenAPI schema reachability.

These tests verify that FastAPI is running, its docs are accessible,
and that the three expected routes are registered in the schema.
"""


def test_docs_returns_200(client):
    """Swagger UI /docs should be served by FastAPI."""
    response = client.get("/docs")
    assert response.status_code == 200


def test_openapi_schema_returns_200(client):
    """OpenAPI JSON schema should be accessible at /openapi.json."""
    response = client.get("/openapi.json")
    assert response.status_code == 200


def test_openapi_schema_has_required_keys(client):
    """OpenAPI schema must contain the 'openapi' and 'paths' top-level keys."""
    schema = client.get("/openapi.json").json()
    assert "openapi" in schema
    assert "paths" in schema


def test_openapi_schema_registers_all_routes(client):
    """All three endpoint paths must appear in the OpenAPI schema."""
    paths = client.get("/openapi.json").json()["paths"]
    assert "/contact" in paths
    assert "/newsletter" in paths
    assert "/chat" in paths
