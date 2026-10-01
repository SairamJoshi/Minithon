import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime
from typing import List, Dict, Any, Optional

from config import (
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    NOTIFICATION_EMAIL,
    FRONTEND_FEED_URL,
    NEWSLETTER_FROM_NAME,
)
from database import (
    get_top_stories_for_newsletter,
    get_active_subscribers,
    update_subscriber_sent_time,
)
from llm_service import generate_llm_completion

logger = logging.getLogger("news_aggregator.newsletter")


def generate_editorial_brief(stories: List[Dict[str, Any]]) -> str:
    """
    Uses the 3-tier LLM fallback pipeline to generate a punchy 2-3 sentence
    executive editorial overview connecting the day's top themes.
    """
    if not stories:
        return "Here is your curated executive briefing of the most impactful global news stories."

    story_headlines = [f"- {s.get('title')} ({s.get('category')})" for s in stories[:5]]
    prompt = f"""Write an engaging, authoritative 2-3 sentence executive summary for today's daily morning newsletter edition.
It should synthesize the major themes connecting these top stories:
{chr(10).join(story_headlines)}

Keep it professional, high-signal, and forward-looking. Do not include markdown headers or bullet points, just the paragraph."""

    try:
        overview, provider = generate_llm_completion(
            prompt,
            system_prompt="You are a senior news editor for an executive intelligence brief."
        )
        logger.info(f"[Newsletter] Editorial note generated using {provider}")
        return overview.strip()
    except Exception as e:
        logger.warning(f"[Newsletter] Failed to generate AI editorial brief: {e}")
        return "Welcome to today's curated edition of the AI News Intelligence Brief. Below are the verified top developments from across global sources, deduplicated and synthesized for rapid executive reading."


def build_newsletter_html(
    stories: List[Dict[str, Any]],
    editorial_note: str,
    feed_url: str = FRONTEND_FEED_URL
) -> str:
    """
    Generates a responsive, modern HTML newsletter with prominent feed profile links,
    story cards, key takeaways, and source attribution badges.
    """
    date_str = datetime.now().strftime("%B %d, %Y")
    
    # Story cards HTML
    stories_html = ""
    for s in stories:
        category = s.get("category", "General")
        sentiment = s.get("sentiment", "neutral").capitalize()
        importance = s.get("importance_score", 50)
        reading_time = s.get("estimated_reading_minutes", 2)
        primary_source = s.get("primary_source", "Web")
        article_url = s.get("url", "#")
        title = s.get("title", "")
        summary = s.get("summary", "")
        thumbnail = s.get("thumbnail")
        takeaways = s.get("key_takeaways", [])
        sources = s.get("sources", [])
        
        # Sources badge string
        if len(sources) > 1:
            sources_names = [src.get("name", "") for src in sources if src.get("name")]
            sources_label = f"Merged coverage from {', '.join(sources_names[:3])}"
        else:
            sources_label = f"Reported by {primary_source}"

        takeaways_list_html = "".join([
            f'<li style="margin-bottom: 6px; color: #374151; font-size: 14px; line-height: 1.5;">{pt}</li>'
            for pt in takeaways[:3]
        ])

        thumbnail_html = ""
        if thumbnail:
            thumbnail_html = f'''
            <div style="margin-bottom: 14px; border-radius: 8px; overflow: hidden; max-height: 200px;">
                <img src="{thumbnail}" alt="{title}" style="width: 100%; height: auto; display: block; object-fit: cover; max-height: 200px;" />
            </div>
            '''

        sentiment_color = "#10B981" if sentiment == "Positive" else "#EF4444" if sentiment == "Negative" else "#6B7280"

        stories_html += f"""
        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <span style="background-color: #f3f4f6; color: #1f2937; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
                    {category}
                </span>
                <span style="font-size: 12px; color: {sentiment_color}; font-weight: 600;">
                    ● {sentiment} • {reading_time} min read
                </span>
            </div>

            {thumbnail_html}

            <h3 style="margin: 0 0 10px 0; font-size: 18px; line-height: 1.4; color: #111827; font-weight: 700;">
                <a href="{article_url}" target="_blank" style="color: #111827; text-decoration: none;">{title}</a>
            </h3>

            <p style="margin: 0 0 14px 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                {summary}
            </p>

            <div style="background-color: #f9fafb; border-left: 3px solid #3b82f6; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 700; color: #1e40af; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em;">
                    Key Takeaways
                </div>
                <ul style="margin: 0; padding-left: 18px;">
                    {takeaways_list_html}
                </ul>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: #6b7280; border-top: 1px solid #f3f4f6; padding-top: 12px; flex-wrap: wrap; gap: 8px;">
                <span style="font-style: italic;">{sources_label}</span>
                <a href="{article_url}" target="_blank" style="color: #2563eb; font-weight: 600; text-decoration: none;">Read Original Story &rarr;</a>
            </div>
        </div>
        """

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily AI News Intelligence Brief</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <div style="max-width: 640px; margin: 0 auto; background-color: #f4f5f7; padding: 24px 16px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 32px 24px; text-align: center; color: #ffffff; margin-bottom: 24px;">
            <div style="display: inline-block; background-color: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; color: #93c5fd; margin-bottom: 12px; text-transform: uppercase;">
                Daily Executive Intelligence
            </div>
            <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 800; letter-spacing: -0.025em; color: #ffffff;">
                AI News Brief
            </h1>
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #94a3b8;">
                {date_str} • Curated from Multi-Source News Engine
            </p>

            <!-- Prominent Feed CTA Link -->
            <div style="margin-top: 16px;">
                <a href="{feed_url}" target="_blank" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);">
                    View Full Interactive Feed &rarr;
                </a>
            </div>
        </div>

        <!-- Editorial Overview -->
        <div style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 20px 24px; margin-bottom: 24px;">
            <div style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
                Today's Executive Synthesis
            </div>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
                {editorial_note}
            </p>
        </div>

        <!-- Stories Section -->
        <div style="margin-bottom: 12px;">
            <div style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding-left: 4px;">
                Top Cleaned & Deduplicated Highlights
            </div>
            {stories_html}
        </div>

        <!-- Secondary Bottom Call to Action -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #1e40af;">
                Explore More News in Real-Time
            </h4>
            <p style="margin: 0 0 16px 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
                Filter by categories, search keyword topics, and view live deduplicated clusters directly in the web feed.
            </p>
            <a href="{feed_url}" target="_blank" style="display: inline-block; background-color: #1d4ed8; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 6px;">
                Access Live Feed Profile &rarr;
            </a>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 16px 8px; color: #94a3b8; font-size: 12px; line-height: 1.5;">
            <p style="margin: 0 0 6px 0;">
                Sent via AI News Intelligence Engine • Automated News Deduplication & Fallback
            </p>
            <p style="margin: 0;">
                Feed Profile URL: <a href="{feed_url}" style="color: #64748b; text-decoration: underline;">{feed_url}</a>
            </p>
        </div>

    </div>
</body>
</html>
"""
    return full_html


def send_newsletter(
    recipient_email: Optional[str] = None,
    recipient_name: Optional[str] = None,
    custom_feed_url: Optional[str] = None,
    top_limit: int = 5
) -> Dict[str, Any]:
    """
    Compiles today's top stories and sends the newsletter via SMTP.
    """
    to_email = recipient_email or NOTIFICATION_EMAIL
    if not to_email:
        raise ValueError("No recipient email provided and NOTIFICATION_EMAIL is not set.")

    if not SMTP_USER or not SMTP_PASSWORD:
        raise ValueError("SMTP_USER or SMTP_PASSWORD is not configured in .env")

    feed_url = custom_feed_url or FRONTEND_FEED_URL

    # 1. Fetch top stories from database
    top_stories = get_top_stories_for_newsletter(limit=top_limit)
    if not top_stories:
        logger.warning("[Newsletter] No stories in database. Generating empty briefing note.")
    
    # 2. Generate editorial note via LLM fallback
    editorial_note = generate_editorial_brief(top_stories)

    # 3. Build HTML content
    html_content = build_newsletter_html(top_stories, editorial_note, feed_url=feed_url)

    # 4. Plain text fallback
    plain_text = f"""Daily AI News Intelligence Brief - {datetime.now().strftime('%B %d, %Y')}

Executive Synthesis:
{editorial_note}

View Full Interactive News Feed:
{feed_url}

Top Highlights:
"""
    for s in top_stories:
        plain_text += f"\n- {s.get('title')}\n  {s.get('summary')}\n  Link: {s.get('url')}\n"

    # 5. Build MIME Email
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"📰 Daily AI Intelligence Brief • {datetime.now().strftime('%b %d, %Y')}"
    msg["From"] = f"{NEWSLETTER_FROM_NAME} <{SMTP_USER}>"
    msg["To"] = to_email

    msg.attach(MIMEText(plain_text, "plain", "utf-8"))
    msg.attach(MIMEText(html_content, "html", "utf-8"))

    # 6. Send via SMTP
    logger.info(f"[Newsletter] Connecting to SMTP {SMTP_HOST}:{SMTP_PORT} to deliver to {to_email}...")
    try:
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20.0)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, [to_email], msg.as_string())
        server.quit()
        logger.info(f"[Newsletter] ✅ Newsletter successfully delivered to {to_email}!")

        # Update last sent timestamp in database
        update_subscriber_sent_time(to_email)

        return {
            "status": "success",
            "recipient": to_email,
            "stories_included": len(top_stories),
            "feed_profile_link": feed_url,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        logger.error(f"[Newsletter] ❌ Failed to send newsletter to {to_email}: {e}")
        raise RuntimeError(f"SMTP sending failed: {e}")


def broadcast_daily_newsletter(custom_feed_url: Optional[str] = None) -> Dict[str, Any]:
    """
    Broadcasts the daily newsletter to all active subscribers and notification address.
    """
    subscribers = get_active_subscribers()
    all_emails = {s["email"] for s in subscribers}
    if NOTIFICATION_EMAIL:
        all_emails.add(NOTIFICATION_EMAIL.lower().strip())

    if not all_emails:
        return {"status": "warning", "message": "No subscribers or notification email found."}

    results = []
    feed_url = custom_feed_url or FRONTEND_FEED_URL

    for email in all_emails:
        try:
            res = send_newsletter(recipient_email=email, custom_feed_url=feed_url)
            results.append({"email": email, "status": "sent"})
        except Exception as e:
            results.append({"email": email, "status": "failed", "error": str(e)})

    return {
        "status": "completed",
        "total_targets": len(all_emails),
        "results": results,
    }
