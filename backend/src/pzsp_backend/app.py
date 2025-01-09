import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from pydantic import BaseModel, ValidationError
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

from src.pzsp_backend.models import OptimisationRequest, OptimisationResponse
from src.pzsp_backend.optimization.constants import (
    DIJKSTRA,
    FAILURE,
    INTEGER_MODEL,
    INVALID_REQUEST,
    SUCCESS,
)
from src.pzsp_backend.optimization.dijkstra import DijkstraOptimizer
from src.pzsp_backend.optimization.integer.optimizer import IntegerProgrammingOptimizer

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

        validate_request(request)
        response = dispatch_optimizer(request)
        print("Response: ", response)

        await websocket.send_json(response.model_dump_json())
    except WebSocketDisconnect:
        print("Client disconnected")
    except ValidationError:
        response = OptimisationResponse(
            type=FAILURE, channel=None, message="Invalid request format", time=None
        )
        await websocket.send_json(response.model_dump_json())
    except ValueError as e:
        response = OptimisationResponse(
            type=FAILURE, channel=None, message=str(e), time=None
        )
        await websocket.send_json(response.model_dump_json())
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
            optimizer = DijkstraOptimizer(network, True, dist_weight, even_load_weight)
        else:
            return OptimisationResponse(
                type=INVALID_REQUEST,
                channel=None,
                message="Invalid optimizer requested: " + request.optimizer,
                time=None,
            )

    except NotImplementedError:
        return OptimisationResponse(
            type=FAILURE, channel=None, message="Optimizer not implemented", time=None
        )

    except Exception as e:
        return OptimisationResponse(
            type=FAILURE, channel=None, message="Optimizer failed: " + str(e), time=None
        )

    start_time = time.time()
    ch = optimizer.find_channel(request)
    end_time = time.time()
    total_time = end_time - start_time
    logger.info("Channel: ", ch, "found in ", total_time, " seconds")
    return OptimisationResponse(
        type=SUCCESS, channel=ch, message="Optimizer found a solution", time=total_time
    )


def validate_request(r: OptimisationRequest):
    """Checks whether the source and target node of a request are actually in its network"""
    if r.source not in r.network.nodes:
        raise ValueError("Invalid source node")
    if r.target not in r.network.nodes:
        raise ValueError("Invalid target node")
