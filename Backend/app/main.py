from enum import Enum
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes import login, signup, chat_endpoints, logout, generating_nickname, get_users

app = FastAPI(
    title="Hafifa",
    version="0.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(get_users.router)
app.include_router(signup.router)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(chat_endpoints.router)
app.include_router(generating_nickname.router)



if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
