from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from server.hendlers.users import router as http_router
from server.hendlers.chats import router as chats_router
from server.hendlers.messages import router as messages_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(http_router)
app.include_router(chats_router)
app.include_router(messages_router)
