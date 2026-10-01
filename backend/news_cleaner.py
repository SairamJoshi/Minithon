import re
import json
import uuid
import logging
from typing import List, Dict, Any, Optional, Tuple
from urllib.parse import urlparse, urlunparse, parse_qsl, urlencode
from llm_service import generate_structured_json

logger = logging.getLogger("news_aggregator.cleaner")


def clean_url(url: str) -> str:
    """Strip tracking query parameters like utm_*, ref, fbclid from URL."""
    try:
        parsed = urlparse(url)
        clean_queries = [
            (k, v) for k, v in parse_qsl(parsed.query)
            if not k.startswith("utm_") and k not in {"ref", "fbclid", "gclid", "source"}
        ]
        return urlunparse((
            parsed.scheme,
            parsed.netloc,
            parsed.path.rstrip("/"),
            parsed.params,
            urlencode(clean_queries),
            ""
        ))
    except Exception:
        return url


def normalize_title(title: str) -> str:
    """Normalize headline for simple fuzzy matching."""
    t = title.lower()
    t = re.sub(r"[^\w\s]", "", t)
    return " ".join(t.split())


def pre_cluster_articles(articles: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Fast pre-deduplication: filters exact URLs and links with identical cleaned URLs.
    """
    seen_urls = set()
    unique_articles = []

    for art in articles:
        u = clean_url(art.get("url", ""))
        if not u or u in seen_urls:
            continue
        seen_urls.add(u)
        art["clean_url"] = u
        unique_articles.append(art)

    return unique_articles


CLEANING_PROMPT_TEMPLATE = """You are an elite news intelligence and data curation engine.
Below is a batch of raw news articles collected from various sources via Google News / SerpAPI.

Your tasks:
1. DEDUPLICATE: Multiple sources often report on the exact same breaking news event or development. Merge duplicate coverage into ONE unified canonical story, retaining citations of all reporting outlets.
2. CLEAN & DE-NOISE: Strip sensational clickbait prefixes (e.g., 'BREAKING:', 'SHOCKING:', 'You won't believe'), remove PR boilerplate, and write a neutral, authoritative headline.
3. EXECUTIVE SUMMARY: Write a concise, factual 2-3 sentence overview explaining what happened, why it matters, and the broader context.
4. KEY TAKEAWAYS: Provide 3 crisp, essential bullet points summarizing key facts or implications.
5. METADATA: Assign a standardized category, sentiment ('positive', 'neutral', or 'negative'), an importance score (1 to 100), tags, and reading time in minutes.

Raw Articles to Process:
{articles_json}

Return ONLY a valid JSON object strictly matching this schema:
{{
  "cleaned_feed": [
    {{
      "canonical_title": "Clean, objective, professional headline",
      "summary": "Concise 2-3 sentence factual overview of the development.",
      "key_takeaways": [
        "First key factual takeaway",
        "Second key factual takeaway",
        "Third key factual takeaway"
      ],
      "category": "Artificial Intelligence | Tech | Geopolitics | Business & Economy | Science | Study Abroad | General",
      "sentiment": "positive" | "neutral" | "negative",
      "importance_score": 85,
      "estimated_reading_minutes": 2,
      "tags": ["AI", "Tech Policy", "OpenAI"],
      "primary_source": "Source Name",
      "primary_url": "https://...",
      "thumbnail": "https://...",
      "merged_sources": [
        {{
          "name": "Washington Post",
          "url": "https://..."
        }}
      ],
      "raw_article_indices": [0, 1]
    }}
  ]
}}
"""


def clean_and_deduplicate_batch(articles_batch: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], str]:
    """
    Sends a batch of articles to the LLM (Groq -> Gemini -> OpenRouter Nemotron)
    for deduplication, cleaning, and summarization.
    """
    if not articles_batch:
        return [], "none"

    # Prepare compact representation for prompt
    input_items = []
    for idx, a in enumerate(articles_batch):
        input_items.append({
            "index": idx,
            "title": a.get("raw_title"),
            "source": a.get("source"),
            "url": a.get("url"),
            "published_at": a.get("published_at"),
            "snippet": a.get("raw_snippet") or "",
            "thumbnail": a.get("thumbnail") or "",
            "query_topic": a.get("query_category", ""),
        })

    prompt = CLEANING_PROMPT_TEMPLATE.format(
        articles_json=json.dumps(input_items, indent=2)
    )

    try:
        data, provider_used = generate_structured_json(
            prompt=prompt,
            system_prompt="You are a senior news editor and automated news feed pipeline. Output strictly valid JSON."
        )

        cleaned_items = data.get("cleaned_feed", [])
        results = []

        for item in cleaned_items:
            # Reconstruct thumbnail and full source list if missing
            indices = item.get("raw_article_indices", [])
            primary_thumb = item.get("thumbnail")

            # Fallback thumbnail from original articles
            if not primary_thumb and indices:
                for idx in indices:
                    if 0 <= idx < len(articles_batch):
                        candidate_thumb = articles_batch[idx].get("thumbnail")
                        if candidate_thumb:
                            primary_thumb = candidate_thumb
                            break

            # Fallback primary url
            primary_url = item.get("primary_url")
            if not primary_url and indices and 0 <= indices[0] < len(articles_batch):
                primary_url = articles_batch[indices[0]].get("url")

            # Fallback primary source
            primary_src = item.get("primary_source")
            if not primary_src and indices and 0 <= indices[0] < len(articles_batch):
                primary_src = articles_batch[indices[0]].get("source")

            # Gather all merged sources
            sources_list = item.get("merged_sources", [])
            if not sources_list and indices:
                for idx in indices:
                    if 0 <= idx < len(articles_batch):
                        orig = articles_batch[idx]
                        sources_list.append({
                            "name": orig.get("source", "Unknown"),
                            "url": orig.get("url", ""),
                        })

            # Publication time
            pub_time = ""
            if indices and 0 <= indices[0] < len(articles_batch):
                pub_time = articles_batch[indices[0]].get("published_at", "")

            feed_entry = {
                "id": str(uuid.uuid4()),
                "title": item.get("canonical_title") or "News Story",
                "summary": item.get("summary") or "",
                "key_takeaways": item.get("key_takeaways") or [],
                "category": item.get("category") or "General",
                "sentiment": item.get("sentiment") or "neutral",
                "importance_score": int(item.get("importance_score", 50)),
                "estimated_reading_minutes": int(item.get("estimated_reading_minutes", 2)),
                "tags": item.get("tags") or [],
                "primary_source": primary_src or "Web",
                "url": primary_url or "",
                "thumbnail": primary_thumb or "",
                "published_at": pub_time,
                "sources": sources_list,
                "sources_count": max(len(sources_list), 1),
                "is_deduplicated": len(sources_list) > 1 or len(indices) > 1,
                "ai_provider": provider_used,
            }
            results.append(feed_entry)

        return results, provider_used

    except Exception as e:
        logger.error(f"[NewsCleaner] LLM cleaning failed: {e}. Generating heuristic fallback.")
        # Graceful fallback: return sanitized original items so feed never breaks
        fallback_results = []
        for a in articles_batch:
            fallback_results.append({
                "id": str(uuid.uuid4()),
                "title": a.get("raw_title", "Untitled News"),
                "summary": a.get("raw_snippet") or a.get("raw_title"),
                "key_takeaways": [a.get("raw_snippet") or "Latest breaking update."],
                "category": a.get("query_category") or "News",
                "sentiment": "neutral",
                "importance_score": 60,
                "estimated_reading_minutes": 2,
                "tags": [a.get("query_category", "News")],
                "primary_source": a.get("source", "Google News"),
                "url": a.get("url", ""),
                "thumbnail": a.get("thumbnail", ""),
                "published_at": a.get("published_at", ""),
                "sources": [{"name": a.get("source", "Google News"), "url": a.get("url", "")}],
                "sources_count": 1,
                "is_deduplicated": False,
                "ai_provider": f"heuristic-fallback (error: {str(e)[:50]})",
            })
        return fallback_results, "heuristic-fallback"


def process_and_clean_news(raw_articles: List[Dict[str, Any]], batch_size: int = 8) -> Tuple[List[Dict[str, Any]], str]:
    """
    Processes all raw articles through pre-deduplication, chunks them into batches,
    and runs the AI cleaning pipeline.
    """
    pre_filtered = pre_cluster_articles(raw_articles)
    if not pre_filtered:
        return [], "none"

    all_cleaned = []
    providers_used = set()

    for i in range(0, len(pre_filtered), batch_size):
        chunk = pre_filtered[i:i + batch_size]
        cleaned_chunk, provider = clean_and_deduplicate_batch(chunk)
        all_cleaned.extend(cleaned_chunk)
        providers_used.add(provider)

    primary_provider = ", ".join(providers_used) if providers_used else "unknown"
    return all_cleaned, primary_provider
