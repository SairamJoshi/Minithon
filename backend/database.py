import sqlite3
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from config import DB_PATH

logger = logging.getLogger("news_aggregator.database")


def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables for cleaned news items and ingestion telemetry."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # News articles table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS news_articles (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                key_takeaways TEXT,
                category TEXT NOT NULL,
                sentiment TEXT,
                importance_score INTEGER DEFAULT 50,
                estimated_reading_minutes INTEGER DEFAULT 2,
                tags TEXT,
                primary_source TEXT,
                url TEXT UNIQUE,
                thumbnail TEXT,
                published_at TEXT,
                sources TEXT,
                sources_count INTEGER DEFAULT 1,
                is_deduplicated BOOLEAN DEFAULT 0,
                ai_provider TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Aggregation runs telemetry table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS aggregation_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                total_raw_fetched INTEGER,
                clean_items_saved INTEGER,
                duplicates_merged INTEGER,
                ai_provider TEXT,
                duration_seconds REAL,
                query_topics TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Newsletter subscribers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                is_active BOOLEAN DEFAULT 1,
                subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_sent_at TIMESTAMP
            )
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles (category);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_news_created ON news_articles (created_at DESC);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_news_importance ON news_articles (importance_score DESC);")
        conn.commit()
        logger.info("[Database] SQLite news database initialized successfully.")


def upsert_news_articles(articles: List[Dict[str, Any]]) -> int:
    """Inserts or updates cleaned news articles."""
    saved_count = 0
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for art in articles:
            takeaways_json = json.dumps(art.get("key_takeaways", []))
            tags_json = json.dumps(art.get("tags", []))
            sources_json = json.dumps(art.get("sources", []))

            cursor.execute("""
                INSERT INTO news_articles (
                    id, title, summary, key_takeaways, category, sentiment,
                    importance_score, estimated_reading_minutes, tags,
                    primary_source, url, thumbnail, published_at, sources,
                    sources_count, is_deduplicated, ai_provider, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(url) DO UPDATE SET
                    title=excluded.title,
                    summary=excluded.summary,
                    key_takeaways=excluded.key_takeaways,
                    category=excluded.category,
                    sentiment=excluded.sentiment,
                    importance_score=excluded.importance_score,
                    tags=excluded.tags,
                    sources=excluded.sources,
                    sources_count=excluded.sources_count,
                    is_deduplicated=excluded.is_deduplicated,
                    ai_provider=excluded.ai_provider,
                    thumbnail=COALESCE(NULLIF(excluded.thumbnail, ''), news_articles.thumbnail)
            """, (
                art.get("id"),
                art.get("title"),
                art.get("summary"),
                takeaways_json,
                art.get("category"),
                art.get("sentiment"),
                art.get("importance_score", 50),
                art.get("estimated_reading_minutes", 2),
                tags_json,
                art.get("primary_source"),
                art.get("url"),
                art.get("thumbnail"),
                art.get("published_at"),
                sources_json,
                art.get("sources_count", 1),
                1 if art.get("is_deduplicated") else 0,
                art.get("ai_provider"),
            ))
            saved_count += 1

        conn.commit()
    return saved_count


def record_aggregation_history(
    total_raw: int,
    clean_saved: int,
    duplicates_merged: int,
    ai_provider: str,
    duration: float,
    query_topics: List[str]
):
    """Records stats about an aggregation and cleaning run."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO aggregation_history (
                total_raw_fetched, clean_items_saved, duplicates_merged,
                ai_provider, duration_seconds, query_topics
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            total_raw,
            clean_saved,
            duplicates_merged,
            ai_provider,
            round(duration, 2),
            json.dumps(query_topics)
        ))
        conn.commit()


def get_news_feed(
    category: Optional[str] = None,
    query: Optional[str] = None,
    sentiment: Optional[str] = None,
    only_deduplicated: bool = False,
    sort_by: str = "latest",  # "latest" | "importance"
    page: int = 1,
    limit: int = 20
) -> Dict[str, Any]:
    """Retrieve filtered, paginated news feed."""
    offset = (page - 1) * limit
    where_clauses = ["1=1"]
    params: List[Any] = []

    if category and category.lower() != "all":
        where_clauses.append("LOWER(category) LIKE ?")
        params.append(f"%{category.lower()}%")

    if query and query.strip():
        where_clauses.append("(LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(tags) LIKE ?)")
        search_term = f"%{query.strip().lower()}%"
        params.extend([search_term, search_term, search_term])

    if sentiment:
        where_clauses.append("sentiment = ?")
        params.append(sentiment.lower())

    if only_deduplicated:
        where_clauses.append("is_deduplicated = 1")

    where_sql = " AND ".join(where_clauses)
    order_sql = "importance_score DESC, created_at DESC" if sort_by == "importance" else "created_at DESC"

    with get_db_connection() as conn:
        cursor = conn.cursor()

        # Count total
        cursor.execute(f"SELECT COUNT(*) FROM news_articles WHERE {where_sql}", params)
        total_count = cursor.fetchone()[0]

        # Fetch records
        cursor.execute(f"""
            SELECT * FROM news_articles
            WHERE {where_sql}
            ORDER BY {order_sql}
            LIMIT ? OFFSET ?
        """, params + [limit, offset])

        rows = cursor.fetchall()
        articles = []
        for r in rows:
            articles.append({
                "id": r["id"],
                "title": r["title"],
                "summary": r["summary"],
                "key_takeaways": json.loads(r["key_takeaways"]) if r["key_takeaways"] else [],
                "category": r["category"],
                "sentiment": r["sentiment"],
                "importance_score": r["importance_score"],
                "estimated_reading_minutes": r["estimated_reading_minutes"],
                "tags": json.loads(r["tags"]) if r["tags"] else [],
                "primary_source": r["primary_source"],
                "url": r["url"],
                "thumbnail": r["thumbnail"],
                "published_at": r["published_at"],
                "sources": json.loads(r["sources"]) if r["sources"] else [],
                "sources_count": r["sources_count"],
                "is_deduplicated": bool(r["is_deduplicated"]),
                "ai_provider": r["ai_provider"],
                "created_at": r["created_at"],
            })

    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 1

    return {
        "page": page,
        "limit": limit,
        "total_items": total_count,
        "total_pages": total_pages,
        "items": articles,
    }


def get_news_article_by_id(article_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve single article detail."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM news_articles WHERE id = ?", (article_id,))
        r = cursor.fetchone()
        if not r:
            return None

        return {
            "id": r["id"],
            "title": r["title"],
            "summary": r["summary"],
            "key_takeaways": json.loads(r["key_takeaways"]) if r["key_takeaways"] else [],
            "category": r["category"],
            "sentiment": r["sentiment"],
            "importance_score": r["importance_score"],
            "estimated_reading_minutes": r["estimated_reading_minutes"],
            "tags": json.loads(r["tags"]) if r["tags"] else [],
            "primary_source": r["primary_source"],
            "url": r["url"],
            "thumbnail": r["thumbnail"],
            "published_at": r["published_at"],
            "sources": json.loads(r["sources"]) if r["sources"] else [],
            "sources_count": r["sources_count"],
            "is_deduplicated": bool(r["is_deduplicated"]),
            "ai_provider": r["ai_provider"],
            "created_at": r["created_at"],
        }


def get_feed_stats() -> Dict[str, Any]:
    """Retrieve feed statistics, categories breakdown, and latest history."""
    with get_db_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM news_articles")
        total_articles = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM news_articles WHERE is_deduplicated = 1")
        total_deduplicated = cursor.fetchone()[0]

        cursor.execute("""
            SELECT category, COUNT(*) as count
            FROM news_articles
            GROUP BY category
            ORDER BY count DESC
        """)
        categories = [{"name": row["category"], "count": row["count"]} for row in cursor.fetchall()]

        cursor.execute("""
            SELECT * FROM aggregation_history
            ORDER BY timestamp DESC
            LIMIT 5
        """)
        history = [dict(row) for row in cursor.fetchall()]

    return {
        "total_articles": total_articles,
        "total_deduplicated_clusters": total_deduplicated,
        "categories": categories,
        "recent_runs": history,
    }


def add_subscriber(email: str, name: Optional[str] = None) -> bool:
    """Add or reactivate a newsletter subscriber."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO newsletter_subscribers (email, name, is_active)
            VALUES (?, ?, 1)
            ON CONFLICT(email) DO UPDATE SET is_active = 1
        """, (email.strip().lower(), name))
        conn.commit()
    return True


def get_active_subscribers() -> List[Dict[str, Any]]:
    """Get all active newsletter subscribers."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM newsletter_subscribers WHERE is_active = 1")
        return [dict(row) for row in cursor.fetchall()]


def update_subscriber_sent_time(email: str):
    """Update last_sent_at timestamp for a subscriber."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO newsletter_subscribers (email, is_active, last_sent_at)
            VALUES (?, 1, CURRENT_TIMESTAMP)
            ON CONFLICT(email) DO UPDATE SET last_sent_at = CURRENT_TIMESTAMP
        """, (email.strip().lower(),))
        conn.commit()


# Ensure tables exist on load
init_db()



def get_top_stories_for_newsletter(limit: int = 5) -> List[Dict[str, Any]]:
    """Retrieve highest-signal, most important news stories for the daily digest."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM news_articles
            ORDER BY is_deduplicated DESC, importance_score DESC, created_at DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        
        stories = []
        for r in rows:
            stories.append({
                "id": r["id"],
                "title": r["title"],
                "summary": r["summary"],
                "key_takeaways": json.loads(r["key_takeaways"]) if r["key_takeaways"] else [],
                "category": r["category"],
                "sentiment": r["sentiment"],
                "importance_score": r["importance_score"],
                "estimated_reading_minutes": r["estimated_reading_minutes"],
                "tags": json.loads(r["tags"]) if r["tags"] else [],
                "primary_source": r["primary_source"],
                "url": r["url"],
                "thumbnail": r["thumbnail"],
                "published_at": r["published_at"],
                "sources": json.loads(r["sources"]) if r["sources"] else [],
                "sources_count": r["sources_count"],
                "is_deduplicated": bool(r["is_deduplicated"]),
                "ai_provider": r["ai_provider"],
            })
        return stories

