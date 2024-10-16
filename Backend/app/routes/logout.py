from fastapi import APIRouter, Depends, HTTPException, status
from app.layers import authorization as auth


router = APIRouter(
    prefix="/logout",
    tags=["logout"]
)


@router.post("")
async def handle_logout(token: str = Depends(auth.oauth2_scheme)):
    if auth.is_token_invalid(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Logout failed",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Invalidate the token
    auth.invalidate_token(token)
    return {"message": "Logout successful"}
