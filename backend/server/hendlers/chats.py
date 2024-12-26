import asyncio

from fastapi import WebSocket, APIRouter
from starlette.responses import JSONResponse

from server.base_includer import chat_worker, user_worker

router = APIRouter(prefix="/chats")


def form_chats(chats: list[tuple], user_chat_id: str) -> dict:
    returned = {"type": "chats", "chats": []}
    for i in chats:
        other_user_id = i[1] if i[1] != user_chat_id else i[2]
        chat_name = user_worker.get_user(other_user_id)[1]
        returned["chats"].append({"chat_id": i[0], "chat_name": chat_name})
    return returned


@router.websocket("/ws/{user_id}")
async def start_chats_connection(user_id: str, websocket: WebSocket):
    await websocket.accept()
    current_chats_count = 0
    while True:
        chats = chat_worker.get_user_chats(user_id)
        if current_chats_count < len(chats):
            current_chats_count = len(chats)
            await websocket.send_json(form_chats(chats, user_id))
        await asyncio.sleep(1)


@router.post("/add_chat/{first_user}/{second_user}")
async def add_chat(first_user: str, second_user: str):
    if chat_worker.is_every_created(first_user, second_user):
        return JSONResponse("chat every created", status_code=403)

    if first_user == second_user:
        return JSONResponse("the user cannot write to himself", status_code=403)

    if not user_worker.get_user(first_user) or not user_worker.get_user(second_user):
        return JSONResponse("user dont found", status_code=403)

    chat_worker.insert_new_row({f"first_user_id": first_user, "second_user_id": second_user})
