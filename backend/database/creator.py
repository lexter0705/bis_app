from sqlalchemy import create_engine, ForeignKey, String
from sqlalchemy.orm import DeclarativeBase, Mapped, relationship, backref
from sqlalchemy.testing.schema import mapped_column


class Base(DeclarativeBase):
    pass


class MessageTypes(Base):
    __tablename__ = 'message_types'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]


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


class Calls(Base):
    __tablename__ = "calls"
    id: Mapped[int] = mapped_column(primary_key=True)
    time: Mapped[int]
    chat_id: Mapped[int] = mapped_column(ForeignKey('chat.id'))
    chat: Mapped[ChatTable] = relationship(ChatTable, backref=backref("children", cascade="all,delete"))


class StickerPacks(Base):
    __tablename__ = 'sticker_packs'
    id: Mapped[int] = mapped_column(primary_key=True)
    owner_address: Mapped[str] = mapped_column(ForeignKey('user.user_id'))
    user: Mapped[UserTable] = relationship(UserTable, backref=backref("children", cascade="all,delete"))


class Stickers(Base):
    __tablename__ = 'stickers'
    id: Mapped[int] = mapped_column(primary_key=True)
    pack_id: Mapped[str] = mapped_column(ForeignKey('pack.id'))
    image_path: Mapped[str]
    pack: Mapped[StickerPacks] = relationship(StickerPacks, backref=backref("children", cascade="all,delete"))


class ReactionTypes(Base):
    __tablename__ = "reaction_types"
    id: Mapped[int] = mapped_column(primary_key=True)
    emoji: Mapped[str]


class Reactions:
    __tablename__ = "reactions"
    id: Mapped[int] = mapped_column(primary_key=True)
    reaction_type: Mapped[int] = mapped_column(ForeignKey('message.id'))
    from_user_id: Mapped[int] = mapped_column(ForeignKey('message.id'))
    message_id: Mapped[str] = mapped_column(ForeignKey('message.id'))
    message: Mapped[MessageTable] = relationship(MessageTable, backref=backref("children", cascade="all,delete"))
    user: Mapped[UserTable] = relationship(UserTable, backref=backref("children", cascade="all,delete"))
    reaction: Mapped[ReactionTypes] = relationship(ReactionTypes, backref=backref("children", cascade="all,delete"))


def create_database(path: str):
    engine = create_engine("sqlite:///" + path)
    Base.metadata.create_all(engine)


if __name__ == "__main__":
    create_database(path="./main.db")
