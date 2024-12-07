import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

from src.pzsp_backend.optimization.integer.model_demo import (
    ModelParams,
    solve_instance,
)


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


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/message-length")
def get_message_length(msg: Message):
    return {"length": len(msg.message)}


@app.websocket("/ws/optimizer")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        params = ModelParams.model_validate_json(data)
        print(f"Received params: {params}")
        await websocket.send_text(f"Received params: {params}, processing...")
        await asyncio.sleep(3)
        x, y = solve_instance(params)
        await websocket.send_text(
            f"Optimization finished. x: {round(x, 2)}, y: {round(y, 2)}"
        )
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()
        print("Finished")
