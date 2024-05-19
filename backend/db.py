from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from datetime import datetime

db = SQLAlchemy()


class Element(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(30), nullable=False)
    feedId = db.Column(db.Integer, nullable=False)
    feed = db.Column(db.Text, nullable=True)
    feedTime = db.Column(db.DateTime, nullable=True)
    state = db.Column(db.Integer, nullable=True)
    image_path = db.Column(db.String(100), nullable=True)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"Element('{self.user_id}', '{self.feedId}', '{self.feed}', '{self.image_path}', '{self.content}')"

    def serialize_feed(self):
        return {
            "id": self.id,
            "feedId": self.feedId,
            "feed": self.feed,
            "feedTime": self.feedTime,
            "image_path": self.image_path,
        }


from enum import Enum


class SenderEnum(Enum):
    USER = 0
    ASSISTANT = 1
    SYSTEM = 2


class User(db.Model):
    __tablename__ = "user"
    UId = db.Column(db.Integer, primary_key=True)
    UName = db.Column(db.String, nullable=False)
    Email = db.Column(db.String, nullable=False)
    Persona = db.Column(db.Text, nullable=True)

    Chats = db.relationship("Chat", backref="user", lazy=True)


class Chat(db.Model):
    __tablename__ = "chat"
    ChatId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UId = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    Date = db.Column(db.DateTime, default=datetime.now, nullable=False)

    Messages = db.relationship("Message", backref="chat", lazy=True)
    Diariy = db.relationship("Diary", backref="chat", lazy=True)


class Message(db.Model):
    __tablename__ = "message"
    MessageId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ChatId = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    Message = db.Column(db.Text, nullable=False)
    Sender = db.Column(db.Enum(SenderEnum), nullable=False)
    Time = db.Column(db.Time, default=datetime.now().time, nullable=False)

    def serialize(self):
        return {
            "MessageId": self.MessageId,
            "ChatId": self.ChatId,
            "Message": self.Message,
            "Sender": self.Sender.name,
            "Time": self.Time,
        }

    def serialize_for_ai(self):
        return {
            "sender": self.Sender.name,
            "content": self.Message,
        }


class Diary(db.Model):
    __tablename__ = "diary"
    DiaryId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ChatId = db.Column(db.Integer, db.ForeignKey("chat.id"), nullable=False)
    Content = db.Column(db.Text, nullable=True)
    ImgURL = db.Column(db.String, nullable=True)
    CreatedAt = db.Column(db.DateTime, default=datetime.now, nullable=False)
    UpdatedAt = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now, nullable=False
    )
