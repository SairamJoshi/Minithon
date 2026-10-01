import logging
import requests
from typing import List, Dict, Any, Optional
from config import SERP_API_KEY, SERP_API_URL

logger = logging.getLogger("news_aggregator.serp")

DEFAULT_CATEGORIES = {
    "technology": "Artificial Intelligence & Technology",
    "business": "Global Business & Economy",
    "world": "World News & Geopolitics",
    "science": "Science, Innovation & Climate",
    "education": "Higher Education & Study Abroad",
}


def fetch_serp_news(
    query: str,
    gl: str = "us",
    hl: str = "en",
    num_results: int = 15
) -> List[Dict[str, Any]]:
    """
    Fetch raw news articles from SerpAPI Google News engine.
    Handles flat articles and clustered 'stories'.
    """
    if not SERP_API_KEY:
        raise ValueError("SERP_API_KEY is not configured.")

    params = {
        "engine": "google_news",
        "q": query,
        "gl": gl,
        "hl": hl,
        "api_key": SERP_API_KEY,
    }

    try:
        logger.info(f"[SerpAPI] Querying news for '{query}'...")
        response = requests.get(SERP_API_URL, params=params, timeout=20.0)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        logger.error(f"[SerpAPI] Error requesting news for '{query}': {e}")
        return []

    raw_news = data.get("news_results", [])
    extracted_articles: List[Dict[str, Any]] = []

    for item in raw_news:
        # Check if item contains sub-stories (cluster)
        stories = item.get("stories", [])
        if stories:
            for s in stories:
                article = _normalize_article(s, default_category=query)
                if article:
                    extracted_articles.append(article)
        else:
            article = _normalize_article(item, default_category=query)
            if article:
                extracted_articles.append(article)

    logger.info(f"[SerpAPI] Extracted {len(extracted_articles)} raw articles for '{query}'")
    return extracted_articles[:num_results]


def _normalize_article(item: Dict[str, Any], default_category: str) -> Optional[Dict[str, Any]]:
    """Normalize raw SerpAPI item into a standardized dictionary."""
    title = item.get("title", "").strip()
    link = item.get("link", "").strip()
    if not title or not link:
        return None

    # Source info
    source_obj = item.get("source", {})
    if isinstance(source_obj, dict):
        source_name = source_obj.get("name", "Unknown Source")
        source_icon = source_obj.get("icon", "")
        authors = source_obj.get("authors", [])
    else:
        source_name = str(source_obj) or "Unknown Source"
        source_icon = ""
        authors = []

    # Thumbnail
    thumbnail = item.get("thumbnail") or item.get("thumbnail_small") or ""
    date_str = item.get("date") or item.get("iso_date") or ""
    snippet = item.get("snippet", "").strip()

    return {
        "raw_title": title,
        "url": link,
        "source": source_name,
        "source_icon": source_icon,
        "authors": authors,
        "thumbnail": thumbnail,
        "published_at": date_str,
        "raw_snippet": snippet,
        "query_category": default_category,
    }


def aggregate_news_from_sources(categories: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Fetch news across multiple key topic areas to create a diverse news pipeline.
    """
    if not categories:
        categories = list(DEFAULT_CATEGORIES.values())

    all_raw_articles = []
    for cat in categories:
        articles = fetch_serp_news(cat, num_results=10)
        all_raw_articles.extend(articles)

    return all_raw_articles
