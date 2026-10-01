import time
import logging
from typing import List, Optional
from fastapi import FastAPI, BackgroundTasks, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field, EmailStr

from config import (
    SERP_API_KEY,
    GROQ_PRIMARY_MODEL,
    GROQ_API_KEY,
    GEMINI_API_KEY,
    OPENROUTER_API_KEY,
    SMTP_HOST,
    SMTP_USER,
    NOTIFICATION_EMAIL,
    FRONTEND_FEED_URL,
)
from database import (
    init_db,
    upsert_news_articles,
    record_aggregation_history,
    get_news_feed,
    get_news_article_by_id,
    get_feed_stats,
    add_subscriber,
    get_active_subscribers,
    get_top_stories_for_newsletter,
)
from serp_service import aggregate_news_from_sources, fetch_serp_news, DEFAULT_CATEGORIES
from news_cleaner import process_and_clean_news
from newsletter_service import (
    send_newsletter,
    broadcast_daily_newsletter,
    build_newsletter_html,
    generate_editorial_brief,
)

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("news_aggregator.api")

app = FastAPI(
    title="AI News Intelligence & Deduplication API",
    description="Aggregates multi-source news via SerpAPI, deduplicates and cleans via LLM fallback (Groq -> Gemini -> OpenRouter Nemotron), and serves a high-signal feed.",
    version="1.0.0",
)

# CORS Configuration for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request & Response Models
class RefreshRequest(BaseModel):
    categories: Optional[List[str]] = Field(
        default=None,
        description="Optional custom categories or search terms to aggregate news for."
    )
    batch_size: int = Field(
        default=8,
        description="Number of raw articles sent per LLM deduplication chunk."
    )
    async_mode: bool = Field(
        default=False,
        description="If True, pipeline runs in the background and returns an immediate response."
    )


class SendNewsletterRequest(BaseModel):
    recipient_email: Optional[str] = Field(
        default=None,
        description="Recipient email address. Defaults to NOTIFICATION_EMAIL if omitted."
    )
    custom_feed_url: Optional[str] = Field(
        default=None,
        description="Custom feed link / profile URL to feature in the email CTA button."
    )
    async_mode: bool = Field(
        default=False,
        description="Whether to dispatch email via background worker task."
    )


class SubscribeRequest(BaseModel):
    email: str = Field(..., description="Subscriber email address")
    name: Optional[str] = Field(default=None, description="Subscriber name")



@app.on_event("startup")
def on_startup():
    logger.info("[Startup] Initializing SQLite database...")
    init_db()


def run_pipeline(categories: Optional[List[str]] = None, batch_size: int = 8) -> dict:
    """Core aggregation and LLM deduplication pipeline."""
    start_time = time.time()
    logger.info("[Pipeline] Starting aggregation from SerpAPI...")
    
    # 1. Fetch raw articles
    raw_articles = aggregate_news_from_sources(categories)
    total_raw = len(raw_articles)
    logger.info(f"[Pipeline] Ingested {total_raw} raw articles from SerpAPI.")

    if not raw_articles:
        return {
            "status": "warning",
            "message": "No news articles retrieved from SerpAPI.",
            "total_raw": 0,
            "cleaned_saved": 0,
            "duplicates_merged": 0,
            "duration_seconds": round(time.time() - start_time, 2),
        }

    # 2. Clean, deduplicate, and summarize via LLM fallback
    logger.info("[Pipeline] Processing articles through LLM cleaning & deduplication engine...")
    cleaned_articles, ai_provider = process_and_clean_news(raw_articles, batch_size=batch_size)

    # 3. Save to database
    saved_count = upsert_news_articles(cleaned_articles)
    duplicates_merged = max(0, total_raw - len(cleaned_articles))
    duration = time.time() - start_time

    # 4. Telemetry record
    record_aggregation_history(
        total_raw=total_raw,
        clean_saved=saved_count,
        duplicates_merged=duplicates_merged,
        ai_provider=ai_provider,
        duration=duration,
        query_topics=categories or list(DEFAULT_CATEGORIES.values()),
    )

    logger.info(
        f"[Pipeline] Finished in {duration:.2f}s! Raw: {total_raw}, Clean Feed: {saved_count}, "
        f"Merged: {duplicates_merged}, AI: {ai_provider}"
    )

    return {
        "status": "success",
        "total_raw": total_raw,
        "cleaned_saved": saved_count,
        "duplicates_merged": duplicates_merged,
        "ai_provider": ai_provider,
        "duration_seconds": round(duration, 2),
    }


@app.get("/")
def root():
    return {
        "service": "AI News Intelligence & Deduplication API",
        "status": "running",
        "endpoints": {
            "feed": "/api/feed",
            "refresh": "/api/news/refresh",
            "stats": "/api/news/stats",
            "categories": "/api/news/categories",
            "health": "/api/health",
            "docs": "/docs",
        },
    }


@app.get("/api/feed")
def get_feed(
    category: Optional[str] = Query(None, description="Filter by category (e.g. 'Artificial Intelligence', 'Tech', 'Geopolitics')"),
    q: Optional[str] = Query(None, description="Search keyword across title, summary, and tags"),
    sentiment: Optional[str] = Query(None, description="Filter by sentiment: 'positive', 'neutral', 'negative'"),
    only_deduplicated: bool = Query(False, description="Filter only stories merged across multiple outlets"),
    sort_by: str = Query("latest", regex="^(latest|importance)$", description="Sort order: 'latest' or 'importance'"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(15, ge=1, le=100, description="Items per page"),
):
    """
    Returns the cleaned, deduplicated, and enriched news feed for the UI.
    """
    feed_data = get_news_feed(
        category=category,
        query=q,
        sentiment=sentiment,
        only_deduplicated=only_deduplicated,
        sort_by=sort_by,
        page=page,
        limit=limit,
    )
    return {
        "status": "success",
        **feed_data
    }


@app.get("/api/news/{article_id}")
def get_article(article_id: str):
    """Fetch individual news story by ID with full takeaways and source citations."""
    article = get_news_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="News article not found")
    return {"status": "success", "article": article}


@app.post("/api/news/refresh")
def refresh_news(
    payload: RefreshRequest,
    background_tasks: BackgroundTasks
):
    """
    Aggregates fresh news from SerpAPI, runs the Groq -> Gemini -> OpenRouter LLM deduplication
    pipeline, and updates the news feed.
    """
    if payload.async_mode:
        background_tasks.add_task(run_pipeline, payload.categories, payload.batch_size)
        return {
            "status": "processing",
            "message": "News aggregation and AI deduplication pipeline triggered in background."
        }

    result = run_pipeline(payload.categories, payload.batch_size)
    return result


@app.get("/api/news/stats")
def get_stats():
    """Returns database feed metrics and recent aggregation history."""
    stats = get_feed_stats()
    return {"status": "success", **stats}


@app.get("/api/news/categories")
def get_categories():
    """Returns list of categories present in the feed."""
    stats = get_feed_stats()
    return {
        "status": "success",
        "available_defaults": list(DEFAULT_CATEGORIES.values()),
        "in_feed_categories": stats.get("categories", []),
    }


@app.get("/api/health")
def health_check():
    """Health status check of API and provider configurations."""
    return {
        "status": "ok",
        "serpapi_configured": bool(SERP_API_KEY),
        "smtp_configured": bool(SMTP_HOST and SMTP_USER),
        "providers": {
            "primary": {
                "name": "Groq",
                "configured": bool(GROQ_API_KEY),
                "model": GROQ_PRIMARY_MODEL,
            },
            "fallback_1": {
                "name": "Google Gemini",
                "configured": bool(GEMINI_API_KEY),
            },
            "fallback_2": {
                "name": "OpenRouter (Nemotron models)",
                "configured": bool(OPENROUTER_API_KEY),
            },
        },
    }


# ─────────────────────────────────────────────────────────────
# Daily Newsletter & Feed Profile Email Endpoints
# ─────────────────────────────────────────────────────────────

@app.post("/api/newsletter/send")
def trigger_send_newsletter(
    payload: SendNewsletterRequest,
    background_tasks: BackgroundTasks
):
    """
    Sends the curated daily newsletter email via SMTP.
    Includes an editorial brief, top highlights, and a prominent profile link to the news feed.
    """
    target_email = payload.recipient_email or NOTIFICATION_EMAIL
    if not target_email:
        raise HTTPException(status_code=400, detail="Recipient email must be provided or NOTIFICATION_EMAIL set in .env")

    if payload.async_mode:
        background_tasks.add_task(send_newsletter, target_email, None, payload.custom_feed_url)
        return {
            "status": "processing",
            "message": f"Newsletter dispatch queued in background for {target_email}.",
            "target": target_email,
        }

    try:
        result = send_newsletter(
            recipient_email=target_email,
            custom_feed_url=payload.custom_feed_url
        )
        return result
    except Exception as e:
        logger.error(f"[Newsletter Endpoint] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/newsletter/broadcast")
def trigger_broadcast_newsletter(
    background_tasks: BackgroundTasks,
    custom_feed_url: Optional[str] = Query(None, description="Optional custom feed URL to profile in the email")
):
    """
    Broadcasts the daily newsletter to all subscribed users.
    """
    background_tasks.add_task(broadcast_daily_newsletter, custom_feed_url)
    return {
        "status": "processing",
        "message": "Daily newsletter broadcast job started in background."
    }


@app.post("/api/newsletter/subscribe")
def subscribe(payload: SubscribeRequest):
    """Subscribe an email to receive the daily intelligence brief."""
    success = add_subscriber(payload.email, payload.name)
    return {
        "status": "success",
        "message": f"{payload.email} has been subscribed to the daily newsletter.",
        "email": payload.email,
    }


@app.get("/api/newsletter/subscribers")
def list_subscribers():
    """List all active newsletter subscribers."""
    subscribers = get_active_subscribers()
    return {
        "status": "success",
        "count": len(subscribers),
        "subscribers": subscribers,
    }


@app.get("/api/newsletter/preview", response_class=HTMLResponse)
def preview_newsletter(
    custom_feed_url: Optional[str] = Query(None, description="Custom feed link to profile in the CTA"),
    limit: int = Query(5, ge=1, le=15, description="Number of stories to include")
):
    """
    Renders the exact HTML email newsletter directly in the browser so you can preview
    the editorial synthesis, story cards, and feed profile link.
    """
    top_stories = get_top_stories_for_newsletter(limit=limit)
    feed_url = custom_feed_url or FRONTEND_FEED_URL
    editorial = generate_editorial_brief(top_stories)
    html = build_newsletter_html(top_stories, editorial, feed_url=feed_url)
    return HTMLResponse(content=html, status_code=200)

