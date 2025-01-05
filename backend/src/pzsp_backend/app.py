from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

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
    try:
        request = await websocket.receive_json()
        request = OptimisationRequest.model_validate(request)

        print("Request: ", request)

        network = request.network
        response = OptimisationResponse(
            type="success",
            channel=network.channels["C2"],
            message="Optimizer found a solution",
        )

        await websocket.send_json(response.model_dump_json())
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()
        print("Finished")
