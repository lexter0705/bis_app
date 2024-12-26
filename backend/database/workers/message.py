from sqlalchemy import select

from database.creator import MessageTable
from database.worker import DatabaseWorker


class MessageWorker(DatabaseWorker):
    def __init__(self, database_path: str):
        super().__init__(MessageTable, database_path)

    def select_all_messages_in_chat(self, chat_id: int):
        data = self.connect.execute(select(MessageTable).where(MessageTable.chat_id == chat_id)).fetchall()
        return data