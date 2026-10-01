# AI News Intelligence & Deduplication Backend

A FastAPI backend that aggregates multi-source news via SerpAPI Google News engine, deduplicates and cleans articles using a 3-tier LLM fallback pipeline (**Groq → Google Gemini → OpenRouter Nemotron models**), and delivers an enriched news feed ready for frontend UI consumption.

---

## 🚀 Features

- **Multi-Source News Aggregation**: Ingests fresh news clusters from Google News using **SerpAPI**.
- **3-Tier Resilient LLM Fallback Pipeline**:
  1. **Primary**: **Groq** (`openai/gpt-oss-20b`, `openai/gpt-oss-120b`, `qwen/qwen3.8-27b`)
  2. **Secondary**: **Google Gemini** (`gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`)
  3. **Tertiary**: **OpenRouter Nemotron Models** (`nvidia/nemotron-3-super-120b-a12b:free`, `nvidia/nemotron-3-nano-30b-a3b:free`, `nvidia/nemotron-nano-9b-v2:free`, etc.)
- **AI Deduplication & Normalization**: Merges overlapping reports across multiple publications into a single canonical story entity while preserving citations.
- **De-noising & Clickbait Removal**: Strips sensational prefixes and PR fluff to produce objective headlines.
- **Executive Summaries & Takeaways**: Generates 2-3 sentence summaries and 3 key factual takeaway bullets per story.
- **Enriched Metadata**: Auto-categorization, sentiment analysis, importance scoring (1-100), estimated reading times, and topic tags.
- **SQLite Persistence & Search**: Filter by category, keyword search across titles/tags, filter by sentiment or merged status, sort by latest or importance.
- **CORS Enabled**: Configured for cross-origin requests from any React, Next.js, Vue, or mobile frontend.

---

## 📂 Project Structure

```
backend/
├── .env                  # API keys (SerpAPI, Groq, Gemini, OpenRouter)
├── config.py             # Configuration & candidate models
├── database.py           # SQLite persistence layer & query filters
├── llm_service.py        # 3-tier LLM fallback pipeline
├── serp_service.py       # SerpAPI Google News client
├── news_cleaner.py       # Deduplication & cleaning engine
├── main.py               # FastAPI application with REST endpoints
├── run.py                # Server launcher script
├── requirements.txt      # Python dependencies
└── news_database.sqlite  # SQLite database for feed persistence
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Verify `.env` Configuration
Your `.env` file should be configured with your keys (see `.env.example`):
```ini
SERP_API_KEY=your_serp_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_BASE_URL=https://api.groq.com/openai/v1
MODEL_NAME=openai/gpt-oss-20b
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Run the Backend
```bash
python run.py
```
Or directly with Uvicorn:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

- **API Base URL**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`

---

## 📡 API Reference

### 1. `GET /api/feed`
Fetch paginated, filtered news items for the UI feed.

**Query Parameters:**
- `category` *(optional)*: e.g. `Artificial Intelligence`, `Business & Economy`, `Science`
- `q` *(optional)*: Search query matching headline, summary, or tags
- `sentiment` *(optional)*: `positive`, `neutral`, `negative`
- `only_deduplicated` *(optional)*: `true` to show only stories merged from multiple outlets
- `sort_by` *(optional)*: `latest` (default) or `importance`
- `page` *(optional, default 1)*
- `limit` *(optional, default 15)*

**Sample Response:**
```json
{
  "status": "success",
  "page": 1,
  "limit": 15,
  "total_items": 6,
  "total_pages": 1,
  "items": [
    {
      "id": "41a46da3-76f3-4384-9bd3-440e7fca3b1a",
      "title": "Trump Announces AI Summit and Renames Artificial Intelligence to Super Intelligence",
      "summary": "President Trump announced a new AI summit and issued an executive order renaming 'Artificial Intelligence' to 'Super Intelligence'...",
      "key_takeaways": [
        "Trump executive order rebrands AI as Super Intelligence",
        "The summit will convene stakeholders to address governance",
        "The move underscores U.S. efforts to maintain technological leadership"
      ],
      "category": "Artificial Intelligence",
      "sentiment": "neutral",
      "importance_score": 85,
      "estimated_reading_minutes": 2,
      "tags": ["AI", "Tech Policy", "Executive Order"],
      "primary_source": "BBC",
      "url": "https://www.bbc.com/news/articles/...",
      "thumbnail": "https://ichef.bbci.co.uk/...",
      "published_at": "09/30/2026, 04:01 AM",
      "sources": [
        {"name": "The Guardian", "url": "https://..."},
        {"name": "The Hindu", "url": "https://..."}
      ],
      "sources_count": 2,
      "is_deduplicated": true,
      "ai_provider": "groq:openai/gpt-oss-20b"
    }
  ]
}
```

---

### 2. `POST /api/news/refresh`
Trigger live aggregation from SerpAPI and run the AI deduplication pipeline.

**Request Body (JSON):**
```json
{
  "categories": ["AI & Technology", "World News", "Study Abroad"],
  "batch_size": 8,
  "async_mode": false
}
```

---

### 4. `POST /api/newsletter/send`
Sends the daily newsletter email via SMTP containing an AI executive editorial, top curated highlights with takeaway bullets, and a prominent profile link button to the live interactive feed.

**Request Body (JSON):**
```json
{
  "recipient_email": "sairamjoshi.cs@gmail.com",
  "custom_feed_url": "http://localhost:3000/feed",
  "async_mode": false
}
```

---

### 5. `GET /api/newsletter/preview`
Renders the responsive HTML email directly in your web browser so you can preview the exact email formatting, story cards, badges, and feed link CTA before sending.

**URL**: `http://localhost:8000/api/newsletter/preview`

---

### 6. `POST /api/newsletter/broadcast`
Broadcasts the daily brief to all active subscribers.

---

### 7. `POST /api/newsletter/subscribe`
Subscribe a user email to the daily newsletter list.

```json
{
  "email": "user@example.com",
  "name": "Alex"
}
```

---

### 8. `GET /api/news/{id}`
Retrieve a single news story with complete takeaways, metadata, and citation links.

---

### 9. `GET /api/news/categories`
Returns available categories and the count of stories per category in the feed.

---

### 10. `GET /api/news/stats`
Returns feed metrics: total articles, deduplicated clusters merged, and recent pipeline runs.

---

### 11. `GET /api/health`
Health check for SerpAPI, SMTP configuration, and the LLM fallback providers (Groq, Gemini, OpenRouter).
