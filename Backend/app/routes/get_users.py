from fastapi import APIRouter
from fastapi import HTTPException
from app.layers import authorization as auth


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("")
async def read_all_users():
    try:
        users = auth.get_users()
        return {"users": users}
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

