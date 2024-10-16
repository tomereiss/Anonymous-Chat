from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from app.layers.firebase_manager import FirebaseDataManager
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from pydantic import BaseModel

db_instance = FirebaseDataManager()
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
INVALIDATED_TOKENS = set()


# Function to get the current time with timezone information
def get_current_utc_time():
    return datetime.now(timezone.utc)


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hash_password):
    ans = pwd_context.verify(plain_password, hash_password)
    return ans


def authenticate_user(nickname: str, password: str):
    try:
        user_data = db_instance.get_user_by_username(nickname)
        print(f"user data in authenticate_user after db: {user_data}")
        if user_data is None:
            return None
        hash_password = user_data['hash_password']
        print(hash_password)
        print(password)
        if hash_password is None:
            return None
        if not verify_password(password, hash_password):
            return None
        print("after verification in authenticate_user")
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_users():
    try:
        return db_instance.get_all_sign_users()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SignupRequest(BaseModel):
    nickname: str
    password: str


def create_user(signup_request: SignupRequest):
    try:
        user_data = {
            'username': signup_request.nickname,
            'hash_password': get_hash_value(signup_request.password)
        }
        print(user_data)
        return db_instance.create_user(user_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_hash_value(original_password):
    return pwd_context.hash(original_password)


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if is_token_invalid(token):
            raise credentials_exception

        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        uid: str = payload.get("sub")
        if uid is None:
            raise credentials_exception
        return uid
    except JWTError as e:
        raise credentials_exception
    except Exception as e:
        raise credentials_exception


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def invalidate_token(token: str = Depends(oauth2_scheme)):
    # Add the token to the set of invalidated tokens
    INVALIDATED_TOKENS.add(token)


def is_token_invalid(token: str = Depends(oauth2_scheme)):
    # Check if the token is in the set of invalidated tokens
    return (token in INVALIDATED_TOKENS) and (validate_token_expiration(token))


# Function to validate the token expiration
def validate_token_expiration(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token has expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        expiration_time = payload.get("exp")
        if expiration_time is None:
            raise credentials_exception
        if get_current_utc_time() >= datetime.fromtimestamp(expiration_time, timezone.utc):
            raise credentials_exception
        return True
    except JWTError:
        raise credentials_exception



