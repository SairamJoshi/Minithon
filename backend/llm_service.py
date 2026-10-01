import os
import re
import json
import time
import logging
from typing import Optional, Dict, Any, Tuple
from openai import OpenAI
from config import (
    GROQ_API_KEY,
    GROQ_BASE_URL,
    GROQ_MODELS,
    GEMINI_API_KEY,
    GEMINI_MODELS,
    OPENROUTER_API_KEY,
    OPENROUTER_BASE_URL,
    OPENROUTER_NEMOTRON_MODELS,
)

logger = logging.getLogger("news_aggregator.llm")

# Initialize Clients
groq_client = None
if GROQ_API_KEY:
    try:
        groq_client = OpenAI(api_key=GROQ_API_KEY, base_url=GROQ_BASE_URL, timeout=30.0)
    except Exception as e:
        logger.warning(f"Failed to initialize Groq client: {e}")

gemini_client = None
if GEMINI_API_KEY:
    try:
        from google import genai
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    except Exception as e:
        logger.warning(f"Failed to initialize google-genai Client: {e}")

openrouter_client = None
if OPENROUTER_API_KEY:
    try:
        openrouter_client = OpenAI(
            api_key=OPENROUTER_API_KEY,
            base_url=OPENROUTER_BASE_URL,
            timeout=40.0,
            default_headers={
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "News Aggregator Intelligence Engine",
            }
        )
    except Exception as e:
        logger.warning(f"Failed to initialize OpenRouter client: {e}")


def _clean_json_markdown(text: str) -> str:
    """Strip markdown code fence blocks if returned by the LLM."""
    text = text.strip()
    # Match ```json ... ``` or ``` ... ```
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()
    return text


def call_groq(prompt: str, system_prompt: str, json_mode: bool = False) -> Tuple[str, str]:
    """Call Groq API with candidate model fallbacks."""
    if not groq_client:
        raise RuntimeError("Groq client is not initialized or GROQ_API_KEY is missing")

    seen_models = set()
    last_err = None

    for model in GROQ_MODELS:
        if not model or model in seen_models:
            continue
        seen_models.add(model)
        try:
            logger.info(f"[LLM] Trying Groq model: {model}")
            kwargs: Dict[str, Any] = {
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.2 if json_mode else 0.5,
            }
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            response = groq_client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            if content and content.strip():
                logger.info(f"[LLM] ✅ Groq success with model {model}")
                return content.strip(), f"groq:{model}"
        except Exception as e:
            last_err = e
            logger.warning(f"[LLM] Groq model {model} failed: {e}")

    raise RuntimeError(f"All Groq models failed. Last error: {last_err}")


def call_gemini(prompt: str, system_prompt: str, json_mode: bool = False) -> Tuple[str, str]:
    """Call Google Gemini with candidate model fallbacks."""
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is missing")

    last_err = None

    # First attempt: modern google-genai
    if gemini_client:
        for model in GEMINI_MODELS:
            try:
                logger.info(f"[LLM] Trying Gemini model (google-genai): {model}")
                from google.genai import types
                config_kwargs: Dict[str, Any] = {
                    "temperature": 0.2 if json_mode else 0.5,
                    "system_instruction": system_prompt,
                }
                if json_mode:
                    config_kwargs["response_mime_type"] = "application/json"

                response = gemini_client.models.generate_content(
                    model=model,
                    contents=prompt,
                    config=types.GenerateContentConfig(**config_kwargs)
                )
                if response and response.text:
                    logger.info(f"[LLM] ✅ Gemini success with model {model}")
                    return response.text.strip(), f"gemini:{model}"
            except Exception as e:
                last_err = e
                logger.warning(f"[LLM] Gemini model {model} failed: {e}")

    # Fallback to legacy google.generativeai if available
    try:
        import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=GEMINI_API_KEY)
        for model in ["gemini-1.5-flash", "gemini-1.5-pro"]:
            try:
                logger.info(f"[LLM] Trying Gemini legacy: {model}")
                gen_model = legacy_genai.GenerativeModel(
                    model_name=model,
                    system_instruction=system_prompt
                )
                res = gen_model.generate_content(
                    prompt,
                    generation_config={"temperature": 0.2 if json_mode else 0.5}
                )
                if res and res.text:
                    logger.info(f"[LLM] ✅ Gemini legacy success with {model}")
                    return res.text.strip(), f"gemini-legacy:{model}"
            except Exception as e:
                last_err = e
                logger.warning(f"[LLM] Gemini legacy {model} failed: {e}")
    except Exception as e:
        logger.debug(f"google.generativeai fallback attempt failed: {e}")

    raise RuntimeError(f"All Gemini models failed. Last error: {last_err}")


def call_openrouter(prompt: str, system_prompt: str, json_mode: bool = False) -> Tuple[str, str]:
    """Call OpenRouter focusing on Nemotron and free models."""
    if not openrouter_client:
        raise RuntimeError("OpenRouter client is not initialized or OPENROUTER_API_KEY is missing")

    last_err = None
    for model in OPENROUTER_NEMOTRON_MODELS:
        for attempt in range(2):
            try:
                logger.info(f"[LLM] Trying OpenRouter model: {model} (Attempt {attempt+1})")
                kwargs: Dict[str, Any] = {
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.2 if json_mode else 0.6,
                }
                if json_mode:
                    kwargs["response_format"] = {"type": "json_object"}

                response = openrouter_client.chat.completions.create(**kwargs)
                content = response.choices[0].message.content
                if content and content.strip():
                    logger.info(f"[LLM] ✅ OpenRouter success with model {model}")
                    return content.strip(), f"openrouter:{model}"
            except Exception as e:
                last_err = e
                err_str = str(e).lower()
                if "429" in err_str or "rate limit" in err_str:
                    time.sleep(1.5 * (attempt + 1))
                else:
                    break

    raise RuntimeError(f"All OpenRouter Nemotron/free models failed. Last error: {last_err}")


def generate_llm_completion(
    prompt: str,
    system_prompt: str = "You are an expert news analyst, editor, and data cleaning engine.",
    json_mode: bool = False
) -> Tuple[str, str]:
    """
    Unified Fallback Pipeline:
    1. Groq (Fastest)
    2. Google Gemini (Second fallback)
    3. OpenRouter Nemotron / Free models (Third fallback)
    Returns: (result_text, provider_info)
    """
    errors = []

    # 1. Groq
    try:
        return call_groq(prompt, system_prompt, json_mode=json_mode)
    except Exception as e:
        logger.warning(f"[Pipeline] Groq step failed: {e}. Falling back to Gemini...")
        errors.append(f"Groq: {str(e)[:120]}")

    # 2. Gemini
    try:
        return call_gemini(prompt, system_prompt, json_mode=json_mode)
    except Exception as e:
        logger.warning(f"[Pipeline] Gemini step failed: {e}. Falling back to OpenRouter Nemotron...")
        errors.append(f"Gemini: {str(e)[:120]}")

    # 3. OpenRouter Nemotron
    try:
        return call_openrouter(prompt, system_prompt, json_mode=json_mode)
    except Exception as e:
        logger.error(f"[Pipeline] OpenRouter Nemotron step failed: {e}")
        errors.append(f"OpenRouter: {str(e)[:120]}")

    raise RuntimeError(f"All LLM fallback providers failed! Errors: {' | '.join(errors)}")


def generate_structured_json(
    prompt: str,
    system_prompt: str = "You are an expert news editor and JSON extractor. Output valid JSON only."
) -> Tuple[Dict[str, Any], str]:
    """
    Calls the fallback pipeline and parses output as a valid JSON dictionary.
    """
    raw_text, provider_info = generate_llm_completion(prompt, system_prompt=system_prompt, json_mode=True)
    cleaned = _clean_json_markdown(raw_text)
    
    try:
        data = json.loads(cleaned)
        return data, provider_info
    except json.JSONDecodeError:
        # Retry extraction with regex for JSON object or array
        obj_match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
        if obj_match:
            try:
                data = json.loads(obj_match.group(1))
                return data, provider_info
            except Exception:
                pass
        raise ValueError(f"Failed to parse JSON response from {provider_info}: {cleaned[:200]}")
