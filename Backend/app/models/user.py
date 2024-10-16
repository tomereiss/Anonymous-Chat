from pydantic import BaseModel
from chat import Chat


# User model
class User(BaseModel):
    nickname: str
    hash_password: str
    chats: list[Chat] = []

