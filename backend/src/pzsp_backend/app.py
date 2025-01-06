from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState
from loguru import logger

from src.pzsp_backend.optimization.constants import (
    DIJKSTRA,
    FAILURE,
    INTEGER_MODEL,
    INVALID_REQUEST,
    SUCCESS,
)
from src.pzsp_backend.optimization.dijkstra import DijkstraOptimizer
from src.pzsp_backend.optimization.integer.optimizer import IntegerProgrammingOptimizer
from src.pzsp_backend.models import OptimisationRequest, OptimisationResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    message: str


@app.websocket("/ws/optimizer")
async def optimizer_endpoint(websocket: WebSocket):
    await websocket.accept()
    logger.info("Client connected")

    try:
        logger.info("Validating request")
        request = await websocket.receive_json()
        request = OptimisationRequest.model_validate(request)

        print("Request: ", request)

        response = dispatch_optimizer(request)
        print("Response: ", response)

        await websocket.send_json(response.model_dump_json())
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()
        print("Finished")


def dispatch_optimizer(request: OptimisationRequest) -> OptimisationResponse:
    """Dispatches the optimizer based on the request and returns a response"""

    network, dist_weight, even_load_weight = (
        request.network,
        request.distanceWeight,
        request.evenLoadWeight,
    )
    try:
        if request.optimizer == INTEGER_MODEL:
            logger.info("Dispatching IntegerProgrammingOptimizer")
            optimizer = IntegerProgrammingOptimizer(
                network, True, dist_weight, even_load_weight
            )
        elif request.optimizer == DIJKSTRA:
            logger.info("Dispatching DijkstraOptimizer")
            optimizer = DijkstraOptimizer(
                network, True, dist_weight, even_load_weight
            )
        else:
            return OptimisationResponse(
                type=INVALID_REQUEST,
                channel=None,
                message="Invalid optimizer requested: " + request.optimizer,
            )

    except NotImplementedError:
        return OptimisationResponse(
            type=FAILURE, channel=None, message="Optimizer not implemented"
        )

    except Exception as e:
        return OptimisationResponse(
            type=FAILURE, channel=None, message="Optimizer failed: " + str(e)
        )

    ch = optimizer.find_channel(request)
    logger.info("Channel: ", ch)
    return OptimisationResponse(
        type=SUCCESS, channel=ch, message="Optimizer found a solution"
    )
