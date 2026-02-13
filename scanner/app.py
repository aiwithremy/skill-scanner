"""
Skill Scanner API wrapper.

Wraps the cisco-ai-skill-scanner FastAPI app with API key authentication.
The underlying scanner has no auth — this middleware protects it.
"""

import os

from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn

SCANNER_API_KEY = os.environ.get("SCANNER_API_KEY", "")


class APIKeyMiddleware(BaseHTTPMiddleware):
    """Require X-API-Key header on all requests except health check."""

    async def dispatch(self, request: Request, call_next):
        # Allow health check without auth
        if request.url.path in ("/", "/health", "/docs", "/redoc", "/openapi.json"):
            return await call_next(request)

        if not SCANNER_API_KEY:
            return await call_next(request)

        api_key = request.headers.get("X-API-Key", "")
        if api_key != SCANNER_API_KEY:
            return JSONResponse(
                status_code=401,
                content={"error": "Invalid or missing API key"},
            )
        return await call_next(request)


# Import the scanner's FastAPI app and add our auth middleware
from skill_scanner.api.api import app as scanner_app

scanner_app.add_middleware(APIKeyMiddleware)

app = scanner_app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
