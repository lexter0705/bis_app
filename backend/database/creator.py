from sqlalchemy import create_engine, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, relationship, backref
from sqlalchemy.testing.schema import mapped_column


class Base(DeclarativeBase):
    pass

class UserTable(Base):
    __tablename__ = 'user'
    user_id: Mapped[str] = mapped_column(primary_key=True)
    name: Mapped[str]
    private_key: Mapped[str]
    path_to_icon: Mapped[str] = mapped_column(String, nullable=True)


class ChatTable(Base):
    __tablename__ = 'chat'
    id: Mapped[int] = mapped_column(primary_key=True)
    first_user_id: Mapped[str]
    second_user_id: Mapped[str]


class MessageTable(Base):
    __tablename__ = 'message'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_address: Mapped[str] = mapped_column(ForeignKey('user.user_id'))
    chat_id: Mapped[int] = mapped_column(ForeignKey('chat.id'))
    text: Mapped[str]
    time: Mapped[int]
    user: Mapped[UserTable] = relationship(UserTable, backref=backref("children", cascade="all,delete"))
    chat: Mapped[ChatTable] = relationship(ChatTable, backref=backref("children", cascade="all,delete"))


def create_database(path: str):
    engine = create_engine("sqlite:///" + path)
    Base.metadata.create_all(engine)


if __name__ == "__main__":
    create_database(path="./main.db")
