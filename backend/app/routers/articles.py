from fastapi import APIRouter, HTTPException, Depends, Query
from app.dependencies import get_current_user
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from typing import Optional
from app.database import connection


class ArticleCreate(BaseModel):
    title: str
    content: str
    category_id: int
    author_id: int
    next_article_id: Optional[int] = None


class ArticleUpdate(BaseModel):
    title: str
    content: str
    category_id: int
    next_article_id: Optional[int] = None


router = APIRouter()


@router.get("/articles")
def articles(category_id: Optional[int] = Query(default=None), sort: str = Query(default="newest")):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    order = "ASC" if sort == "oldest" else "DESC"
    if category_id:
        cursor.execute(f"SELECT * FROM articles WHERE category_id = %s ORDER BY created_at {order}", (category_id,))
    else:
        cursor.execute(f"SELECT * FROM articles ORDER BY created_at {order}")
    return cursor.fetchall()


@router.get("/articles/{article_id}")
def get_article(article_id: int):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """
        SELECT a.*, n.id AS next_id, n.title AS next_title
        FROM articles a
        LEFT JOIN articles n ON a.next_article_id = n.id
        WHERE a.id = %s
        """,
        (article_id,),
    )
    result = cursor.fetchone()
    if result is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return result


@router.post("/articles")
def create_article(article: ArticleCreate, user_id: int = Depends(get_current_user)):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "INSERT INTO articles(title, content, category_id, author_id, next_article_id) VALUES(%s, %s, %s, %s, %s) RETURNING *",
        (article.title, article.content, article.category_id, article.author_id, article.next_article_id),
    )
    result = cursor.fetchone()
    connection.commit()
    return result


@router.delete("/articles/{article_id}")
def delete_article(article_id: int, user_id: int = Depends(get_current_user)):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("DELETE FROM articles WHERE id = %s", (article_id,))
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    connection.commit()
    return {"message": "Article deleted successfully"}


@router.put("/articles/{article_id}")
def update_article(article_id: int, article: ArticleUpdate, user_id: int = Depends(get_current_user)):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "UPDATE articles SET title = %s, content = %s, category_id = %s, next_article_id = %s WHERE id = %s RETURNING *",
        (article.title, article.content, article.category_id, article.next_article_id, article_id),
    )
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    result = cursor.fetchone()
    connection.commit()
    return result
