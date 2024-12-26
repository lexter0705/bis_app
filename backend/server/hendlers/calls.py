import asyncio

from fastapi import WebSocket, APIRouter
from starlette.responses import JSONResponse

from server.base_includer import chat_worker, user_worker

router = APIRouter(prefix="/calls")


@router.websocket("/")
def open_call_socket(websocket: WebSocket):
    websocket.accept()
    while True:
        pass