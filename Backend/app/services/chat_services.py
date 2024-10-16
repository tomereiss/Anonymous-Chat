# services/chat_service.py
from typing import Dict
from app.layers.firebase_manager import FirebaseDataManager
db_instance = FirebaseDataManager()


def send_message(current_user_id: str, receiver_username: str, content: str) -> Dict:
    print("send_message_chatServices")
    current_user_data = db_instance.get_user_by_uid(current_user_id)
    if not current_user_data:
        raise ValueError(f"Username not found for user_id: {current_user_id}")
    current_username = current_user_data['username']
    receiver_user_data = db_instance.get_user_by_username(receiver_username)
    if not receiver_user_data:
        raise ValueError(f"User not found with username: {receiver_username}")
    receiver_user_id = receiver_user_data['uid']

    current_chat_id = generate_chat_id(current_username, receiver_username)
    receiver_chat_id = generate_chat_id(receiver_username, current_username)
    return db_instance.send_message(current_user_id, receiver_user_id, current_username, receiver_username,
                                    current_chat_id, receiver_chat_id, content)


def retrieve_recent_chats(current_user_id: str):
    return db_instance.get_recent_chats(current_user_id)


def retrieve_chat_with_user(current_user_id: str, other_username: str):
    user_data = db_instance.get_user_by_uid(current_user_id)
    if not user_data:
        raise ValueError(f"Username not found for user_id: {current_user_id}")
    current_username = user_data['username']
    chat = db_instance.get_chat_with_user(current_user_id, current_username, other_username)
    return chat


def create_new_chat(current_user_id: str, other_username: str):
    current_user_data = db_instance.get_user_by_uid(current_user_id)
    if not current_user_data:
        raise ValueError(f"Username not found for user_id: {current_user_id}")
    current_username = current_user_data['username']
    other_user_data = db_instance.get_user_by_username(other_username)
    if not other_user_data:
        raise ValueError(f"User not found with username: {other_username}")
    other_user_id = other_user_data['uid']
    current_chat_id = generate_chat_id(current_username, other_username)
    other_chat_id = generate_chat_id(other_username, current_username)

    db_instance.create_chat(current_username, other_username, current_chat_id, other_chat_id, current_user_id, other_user_id)


def generate_chat_id(current_username: str, other_username: str) -> str:
    return f"{current_username}_{other_username}"
