from pydantic import BaseModel
from datetime import datetime


class Message(BaseModel):
    sender_username: str
    receiver_username: str
    message: str
    timestamp: datetime = datetime.now()


class Chat(BaseModel):
    chat_id: str
    other_username: str
    messages: list[Message] = []
    last_message_timestamp: datetime




