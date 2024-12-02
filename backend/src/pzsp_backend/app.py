from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pzsp_backend.optimization.integer.model_demo import (
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


@app.post("/integer-model-demo")
def integer_model_demo(pp: ModelParams):
    x, y = solve_instance(pp)
    return {"x": x, "y": y}
