from fastapi import APIRouter, Depends, HTTPException
from app.layers.authorization import get_current_user
from app.models.chat import Chat
import app.services.chat_services as chat_ser
from pydantic import BaseModel


router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)


class SendMessageRequest(BaseModel):
    receiver_username: str
    message: str


@router.post("/send")
async def send_message(request: SendMessageRequest, current_user_id: str = Depends(get_current_user)):
    print("Received request to send message")
    print("Received data:", request.model_dump())  # Log the received data
    try:
        m = chat_ser.send_message(current_user_id, request.receiver_username, request.message)
        return {"message": "Message sent successfully", "content": m}
    except Exception as e:
        return {"error": str(e)}


@router.get("/recent_chats")
async def get_recent_chats_endpoint(current_user_id: str = Depends(get_current_user)):
    recent_chats = chat_ser.retrieve_recent_chats(current_user_id)
    return {"recent_chats": recent_chats}


@router.get("/{other_username}")
async def get_chat_with_user_endpoint(other_username: str, current_user_id: str = Depends(get_current_user)):
    chat = chat_ser.retrieve_chat_with_user(current_user_id, other_username)
    return {"chat": chat}


class ChatCreateRequest(BaseModel):
    other_username: str


@router.post("/create")
async def create_new_chat(chat_request: ChatCreateRequest, current_user_id: str = Depends(get_current_user)):
    try:
        new_chat = chat_ser.create_new_chat(current_user_id, chat_request.other_username)
        return {"message": "Chat was created successfully", "newChat": new_chat}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# @router.post("/send_test")
# async def send_message(receiver_id: str, content: str, current_user_id: str = Depends(get_test_current_user)):
#     try:
#         print(current_user_id)
#         response = chat_ser.send_message(current_user_id, receiver_id, content)
#         print(response)
#         return {"message": "Message sent successfully"}
#     except Exception as e:
#         print(e)
#         return {"error": str(e)}
#
#
# @router.get("/recent_chats_test")
# async def get_recent_chats_endpoint():
#     try:
#         recent_chats = chat_ser.retrieve_recent_chats("user_id_11")
#         print(recent_chats)
#         return {"recent_chats": recent_chats}
#     except Exception as e:
#         # Log the error for debugging purposes
#         print(f"An error occurred while retrieving recent chats: {e}")
#         # Raise an HTTPException with a 500 status code to indicate internal server error
#         raise HTTPException(status_code=401, detail="Internal Server Error")
#
#
# @router.get("/{other_user_id}_test")
# async def get_chat_with_user_endpoint(other_user_id: str, current_user_id: str = Depends(get_test_current_user)):
#     chat = chat_ser.get_chat_with_user("user_id_11", other_user_id)
#     print(chat)
#     return {"chat": chat}
