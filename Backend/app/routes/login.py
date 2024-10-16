from fastapi import APIRouter
from fastapi import HTTPException
from starlette import status
from app.layers import authorization as auth
from datetime import timedelta
from pydantic import BaseModel


router = APIRouter(
    prefix="/login",
    tags=["login"]
)


class LoginRequest(BaseModel):
    nickname: str
    password: str


@router.post("")
async def handle_login(login_request: LoginRequest):
    print(f"Received login request: {login_request}")
    user_data = auth.authenticate_user(login_request.nickname, login_request.password)
    if not user_data:
        raise HTTPException(
             status_code=status.HTTP_401_UNAUTHORIZED,
             detail="Incorrect username or password",
             headers={"WWW-Authenticate": "Bearer"},
         )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user_data['uid']}, expires_delta=access_token_expires
    )
    return {"message": "Login successful", "access_token": access_token, "token_type": "bearer"}

