from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from psycopg2 import errors
from pydantic import BaseModel
from app.database import connection
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("SECRET_KEY")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


router = APIRouter()


@router.post("/register")
def user_register(user: UserCreate):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    hashed_password = pwd_context.hash(user.password)
    try:
        cursor.execute(
            "INSERT INTO users(name, email, password_hash) VALUES(%s, %s, %s) RETURNING *",
            (user.name, user.email, hashed_password),
        )
        result = cursor.fetchone()
        connection.commit()
        result.pop("password_hash")
        return result
    except errors.UniqueViolation:
        connection.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")


@router.post("/login")
def user_login(user: UserLogin):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    db_user = cursor.fetchone()
    if db_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token_data = {"user_id": db_user["id"]}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}
