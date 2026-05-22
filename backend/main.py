import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()
connection = psycopg2.connect(os.getenv("DATABASE_URL"))

app = FastAPI()


@app.get("/")
def welcome():
    return {"message": "Welcome to my personal blog!"}


@app.get("/articles")
def articles():
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM articles")
    results = cursor.fetchall()
    return results


@app.get("/articles/{article_id}")
def get_article(article_id: int):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM articles WHERE id = %s", (article_id,))
    result = cursor.fetchone()
    if result == None:
        raise HTTPException(status_code=404, detail="Article not found")
    else:
        return result
