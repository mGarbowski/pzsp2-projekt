import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

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
        await websocket.send_text(f"Message text was: {data}, processing")
        await asyncio.sleep(3)
        await websocket.send_text("Finished processing")
    except WebSocketDisconnect:
        print("Client disconnected")
    finally:
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()
        print("Finished")
