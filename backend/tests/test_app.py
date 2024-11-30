from fastapi.testclient import TestClient

from src.pzsp_backend.app import app

client = TestClient(app)


def test_get_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}
