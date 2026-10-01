import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(ENV_PATH)
else:
    load_dotenv()

# SerpAPI Key
SERP_API_KEY = os.getenv("SERP_API_KEY", "")
SERP_API_URL = "https://serpapi.com/search"

# Groq Config
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_BASE_URL = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
GROQ_PRIMARY_MODEL = os.getenv("MODEL_NAME", "openai/gpt-oss-20b")
GROQ_MODELS = [
    GROQ_PRIMARY_MODEL,
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
    "qwen/qwen3.8-27b",
]

# Gemini Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
]

# OpenRouter Config (focusing on Nemotron models)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
OPENROUTER_NEMOTRON_MODELS = [
    "nvidia/nemotron-3-super-120b-a12b:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "nvidia/nemotron-nano-9b-v2:free",
    "nvidia/llama-3.1-nemotron-70b-instruct:free",
    "openrouter/free",
    "openrouter/auto",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen-2.5-72b-instruct",
]

# Database Path
DB_PATH = BASE_DIR / "news_database.sqlite"

# SMTP & Newsletter Config
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
NOTIFICATION_EMAIL = os.getenv("NOTIFICATION_EMAIL", "sairamjoshi.cs@gmail.com")
FRONTEND_FEED_URL = os.getenv("FRONTEND_FEED_URL", "http://localhost:8000/api/feed")
NEWSLETTER_FROM_NAME = os.getenv("NEWSLETTER_FROM_NAME", "Daily AI News Intelligence")

