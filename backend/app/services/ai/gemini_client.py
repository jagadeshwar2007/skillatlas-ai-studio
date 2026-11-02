import os
import json
import httpx
from typing import Dict, Any, Optional
from app.config import settings

class GeminiClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.gemini_api_key
        # Models to try in order of preference
        self.models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    async def generate_json(self, prompt: str, system_instruction: str = "") -> Optional[Dict[str, Any]]:
        """Call Gemini with JSON mode request. Returns parsed dict or None."""
        if not self.api_key:
            return None

        for model in self.models:
            url = f"{self.base_url}/{model}:generateContent?key={self.api_key}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 0.4,
                    "maxOutputTokens": 4096
                }
            }
            if system_instruction:
                payload["systemInstruction"] = {
                    "parts": [{"text": system_instruction}]
                }

            try:
                async with httpx.AsyncClient(timeout=25.0) as client:
                    response = await client.post(url, json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        text = data["candidates"][0]["content"]["parts"][0]["text"]
                        return json.loads(text)
                    elif response.status_code == 404:
                        # Model name variant, try next
                        continue
                    else:
                        print(f"Gemini API returned status {response.status_code}: {response.text[:200]}")
            except Exception as e:
                print(f"Gemini API error ({model}): {e}")
                continue
        return None

gemini_client = GeminiClient()
