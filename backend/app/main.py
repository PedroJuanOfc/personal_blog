from fastapi import FastAPI
from app.routers import articles

app = FastAPI()

app.include_router(articles.router)


@app.get("/")
def welcome():
    return {"message": "Welcome to my personal blog!"}
