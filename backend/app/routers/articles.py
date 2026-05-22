from fastapi import APIRouter, HTTPException
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from app.database import connection


class ArticleCreate(BaseModel):
    title: str
    content: str
    category_id: int
    author_id: int


router = APIRouter()


@router.get("/articles")
def articles():
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM articles")
    results = cursor.fetchall()
    return results


@router.get("/articles/{article_id}")
def get_article(article_id: int):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM articles WHERE id = %s", (article_id,))
    result = cursor.fetchone()
    if result == None:
        raise HTTPException(status_code=404, detail="Article not found")
    else:
        return result


@router.post("/articles")
def create_article(article: ArticleCreate):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "INSERT INTO articles(title, content, category_id, author_id) VALUES(%s, %s, %s, %s) RETURNING *",
        (article.title, article.content, article.category_id, article.author_id),
    )
    result = cursor.fetchone()
    connection.commit()
    return result
