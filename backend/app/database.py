import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()
connection = psycopg2.connect(os.getenv("DATABASE_URL"))
