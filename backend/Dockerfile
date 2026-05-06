# FROM python:3.11-slim

# # Set working directory
# WORKDIR /app

# # Install system dependencies (curl for healthchecks)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# # Copy requirements first to leverage Docker cache
# COPY requirements.txt .

# # Install dependencies with cache mounts for faster rebuilds
# # 1. Install CPU-only version of Torch
# # 2. Install the rest of the requirements
# RUN --mount=type=cache,target=/root/.cache/pip \
#     pip install torch --index-url https://download.pytorch.org/whl/cpu && \
#     pip install -r requirements.txt

# # Copy the rest of the application code
# COPY . .

# # Default command for development (overridden by docker-compose if needed)
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
# Uncomment out the above lines and comment below lines to build the docker file to run on your local and  below uncommented lines is done for deployment in this case I have choosen railway as my deployment platform
# ── Production Dockerfile (Render / Fly.io / Koyeb compatible) ────────────────
# $PORT is injected at runtime by the platform. Falls back to 8000 locally.
# ──────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

WORKDIR /app

# Install curl (required for HEALTHCHECK)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first — Docker layer cache: only reinstalls when file changes
COPY requirements.txt .

# Install CPU-only torch (much smaller) + all other deps
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefer-binary \
        torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy application source
COPY . .

# Declare the default port
EXPOSE 8000

# Platform health-check — hits /health every 30s after a 60s warm-up window
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# No --reload in production; uses $PORT injected by platform (default 8000 locally)
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]