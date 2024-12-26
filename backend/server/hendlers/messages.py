import asyncio
from time import gmtime, strftime

from fastapi import WebSocket, APIRouter
from pydantic import BaseModel
from starlette.responses import JSONResponse

from server.base_includer import messages_worker

router = APIRouter(prefix="/messages")


class Message(BaseModel):
    chat_id: int
    user: str
    text: str


def form_messages(messages: list[tuple]) -> dict:
    returned = {"type": "messages", "messages": []}
    for i in messages:
        returned["messages"].append({"userId": i[1], "messageText": i[3]})
    return returned


@router.websocket("/ws/{chat_id}")
async def start_messages_connection(chat_id: int, websocket: WebSocket):
    await websocket.accept()
    current_messages_count = 0
    while True:
        messages = messages_worker.select_all_messages_in_chat(chat_id)
        if current_messages_count < len(messages):
            current_messages_count = len(messages)
            await websocket.send_json(form_messages(messages))
        await asyncio.sleep(1)


@router.post("/send_message/")
async def send_message(message: Message):
    data = {"user_address": message.user,
            "chat_id": message.chat_id,
            "text": message.text,
            "time": strftime("%Y-%m-%d %H:%M:%S", gmtime())}
    messages_worker.insert_new_row(data)
    response = JSONResponse("done", 200)
    return response
