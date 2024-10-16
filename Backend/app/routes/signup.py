from fastapi import APIRouter
from app.layers import authorization as auth
from fastapi import HTTPException
from pydantic import BaseModel
from starlette import status


router = APIRouter(
    prefix="/signup",
    tags=["signup"]
)


class SignupRequest(BaseModel):
    nickname: str
    password: str


@router.post("")
async def signup(signup_request: SignupRequest):
    try:
        user_data = auth.create_user(signup_request)
        return {"message": f"User created successfully: {user_data['username']} with UID: {user_data['uid']}"}
    except Exception as e:
        return HTTPException(status_code=400, detail=str(e))
