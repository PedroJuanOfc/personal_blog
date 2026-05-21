from fastapi import FastAPI, HTTPException

app = FastAPI()

fake_articles = [
    {
        "id": 1,
        "title": "FastAPI: creating an API from scratch",
        "category": "Backend",
        "content": "All the content",
    },
    {
        "id": 2,
        "title": "How to install Linux",
        "category": "Linux",
        "content": "All the content",
    },
]


@app.get("/")
def welcome():
    return {"message": "Welcome to my personal blog!"}


@app.get("/articles")
def articles():
    return fake_articles


@app.get("/articles/{article_id}")
def get_article(article_id: int):
    for article in fake_articles:
        if article["id"] == article_id:
            return article
    raise HTTPException(status_code=404, detail="Article not found")
