from fastapi.testclient import TestClient

from src.pzsp_backend.app import app
from src.pzsp_backend.models import Channel, OptimisationRequest, OptimisationResponse
from src.pzsp_backend.optimization.constants import FAILURE, INVALID_REQUEST, SUCCESS

client = TestClient(app=app)


def test_optimizer_endpoint_invalid_request():
    with client.websocket_connect("/ws/optimizer") as ws:
        ws.send_json({"can't parse": "me"})
        response = ws.receive_json()
        response = OptimisationResponse.model_validate(response)
        assert response == OptimisationResponse(
            type=FAILURE, channel=None, message="Invalid request format", time=None
        )


def test_optimizer_endpoint_valid_request(monkeypatch, test_network):

    # Mock the optimizer itself, we're testing the endpoint
    monkeypatch.setattr(
        "src.pzsp_backend.optimization.dijkstra.DijkstraOptimizer.find_channel",
        lambda *_: Channel(
            id="C1", nodes=["N1", "N2"], edges=["E1"], frequency=193.1, width=12.5
        ),
    )

    request = OptimisationRequest(
        network=test_network,
        source="N1",
        target="N2",
        bandwidth="10GB/s",
        optimizer="dijkstra",
        distanceWeight=1,
        evenLoadWeight=1,
    )

    with client.websocket_connect("/ws/optimizer") as ws:
        ws.send_json(OptimisationRequest.model_dump(request))
        response = ws.receive_json()
        response = OptimisationResponse.model_validate_json(response)
        assert response.type == SUCCESS
        assert response.channel == Channel(
            id="C1", nodes=["N1", "N2"], edges=["E1"], frequency=193.1, width=12.5
        )
        assert response.message == "Optimizer found a solution"


def test_optimizer_endpoint_ask_for_nonexisting_optimizer(test_network):
    request = OptimisationRequest(
        network=test_network,
        source="N1",
        target="N2",
        bandwidth="10GB/s",
        optimizer="nonexisting",
        distanceWeight=1,
        evenLoadWeight=1,
    )

    with client.websocket_connect("/ws/optimizer") as ws:
        ws.send_json(OptimisationRequest.model_dump(request))
        response = ws.receive_json()
        response = OptimisationResponse.model_validate_json(response)
        assert response.type == INVALID_REQUEST
        assert response.channel is None
        assert response.message == "Invalid optimizer requested: nonexisting"
