from fastapi import FastAPI
from app.routers import articles, categories, auth

app = FastAPI()

app.include_router(articles.router)
app.include_router(categories.router)
app.include_router(auth.router)


@app.get("/")
def welcome():
    return {"message": "Welcome to my personal blog!"}
