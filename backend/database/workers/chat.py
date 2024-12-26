from sqlalchemy import select, or_, and_

from database.creator import ChatTable
from database.worker import DatabaseWorker


class ChatWorker(DatabaseWorker):
    def __init__(self, database_path: str):
        super().__init__(ChatTable, database_path)

    def get_user_chats(self, user_address: str) -> list[tuple]:
        data = self.connect.execute(select(ChatTable).where(
            or_(ChatTable.first_user_id == user_address, ChatTable.second_user_id == user_address))).fetchall()
        return data

    def is_every_created(self, first_user_id: str, second_user_id: str) -> bool:
        data_first = self.connect.execute(select(ChatTable).where(and_(ChatTable.first_user_id == first_user_id, ChatTable.second_user_id == second_user_id))).fetchall()
        data_second = self.connect.execute(select(ChatTable).where(and_(ChatTable.first_user_id == second_user_id, ChatTable.second_user_id == first_user_id))).fetchall()
        print(data_first, data_second)
        return len(data_second) > 0 and len(data_first) > 0