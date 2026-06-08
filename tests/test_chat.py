"""
Tests: POST /chat

Covers:
  - Missing 'message' field triggers 422 Pydantic validation
  - Mocked Gemini call returns the mocked text as 'response'
  - Gemini exception triggers the safe fallback response (not a 500)
  - Live Gemini call returns a non-empty response (skipped if no API key)

The Gemini client is a module-level object in main.py:
    client = genai.Client(api_key=...)
We patch 'main.client.models.generate_content' to avoid real API calls
in the non-live tests.
"""
import pytest
from unittest.mock import MagicMock, patch


def test_chat_missing_message_returns_422(client):
    """Omitting the 'message' field must fail Pydantic validation."""
    response = client.post("/chat", json={})
    assert response.status_code == 422


def test_chat_mocked_gemini_returns_response(client):
    """
    With a mocked Gemini call, the endpoint should return the mocked text
    verbatim inside the 'response' key.
    """
    mock_resp = MagicMock()
    mock_resp.text = "¡Hola! Soy GameX Helper 🎮"

    with patch("main.client.models.generate_content", return_value=mock_resp):
        response = client.post("/chat", json={"message": "Hola"})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["response"] == "¡Hola! Soy GameX Helper 🎮"


def test_chat_gemini_exception_returns_safe_fallback(client):
    """
    When Gemini raises an unexpected exception, the endpoint must catch it
    and return a safe fallback string — never a 500 or a raw traceback.
    """
    with patch(
        "main.client.models.generate_content",
        side_effect=Exception("Simulated API failure"),
    ):
        response = client.post("/chat", json={"message": "¿Horario?"})

    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 0


def test_chat_prompt_includes_user_message(client):
    """
    The prompt sent to Gemini must embed the user's message so it is not
    answered out of context.
    """
    mock_resp = MagicMock()
    mock_resp.text = "ok"
    captured_kwargs = {}

    def capture(*args, **kwargs):
        captured_kwargs.update(kwargs)
        return mock_resp

    with patch("main.client.models.generate_content", side_effect=capture):
        client.post("/chat", json={"message": "mi_mensaje_unico_xyz"})

    # The user's text must appear somewhere in the contents sent to Gemini
    contents = str(captured_kwargs.get("contents", ""))
    assert "mi_mensaje_unico_xyz" in contents


@pytest.mark.needs_gemini
def test_chat_real_gemini_returns_non_empty(client):
    """
    Live integration test — only runs when GEMINI_API_KEY is present.
    Sends a real question and asserts the response is a non-trivial string.
    """
    response = client.post(
        "/chat", json={"message": "¿Cuáles son vuestros horarios de apertura?"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert len(data["response"]) > 10
