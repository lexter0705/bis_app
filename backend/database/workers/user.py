from sqlalchemy import select
from database.creator import UserTable
from database.worker import DatabaseWorker


class UserWorker(DatabaseWorker):
    def __init__(self, database_path: str):
        super().__init__(UserTable, database_path)

    def get_user(self, user_id: str):
        users = self.connect.execute(select(UserTable).where(UserTable.user_id == user_id)).first()
        return users