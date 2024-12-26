from database.workers.chat import ChatWorker
from database.workers.message import MessageWorker
from database.workers.user import UserWorker

chat_worker = ChatWorker("./database/main.db")
messages_worker = MessageWorker("./database/main.db")
user_worker = UserWorker("./database/main.db")
