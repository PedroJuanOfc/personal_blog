from fastapi import APIRouter, HTTPException, Depends
from app.dependencies import get_current_user
from psycopg2.extras import RealDictCursor
from psycopg2 import errors
from pydantic import BaseModel
from app.database import connection


class CreateCategory(BaseModel):
    name: str


router = APIRouter()


@router.get("/categories")
def categories():
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM categories")
    result = cursor.fetchall()
    return result


@router.post("/categories")
def create_category(category: CreateCategory, user_id: int = Depends(get_current_user)):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "INSERT INTO categories(name) VALUES(%s) RETURNING *", (category.name,)
    )
    result = cursor.fetchone()
    connection.commit()
    return result


@router.put("/categories/{category_id}")
def update_category(category_id: int, category: CreateCategory, user_id: int = Depends(get_current_user)):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        "UPDATE categories SET name = %s WHERE id = %s RETURNING *",
        (category.name, category_id),
    )
    result = cursor.fetchone()
    connection.commit()
    return result


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, user_id: int = Depends(get_current_user)):
    cursor = connection.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("DELETE FROM categories WHERE id = %s", (category_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Category not found")
        connection.commit()
        return {"message": "Category deleted successfully"}
    except errors.ForeignKeyViolation:
        raise HTTPException(status_code=400, detail="Cannot delete category: there are articles using it.")
