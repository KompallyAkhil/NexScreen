
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
# ── Render (free tier) production Dockerfile ──────────────────────────────────
# Render injects $PORT at runtime. Falls back to 8000 for local docker-compose.
# ──────────────────────────────────────────────────────────────────────────────

FROM python:3.11-slim

WORKDIR /app

# Install curl (needed for HEALTHCHECK)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (leverages Docker layer cache)
COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefer-binary \
        torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir --prefer-binary -r requirements.txt

# Copy application source
COPY . .

# Tell Render / Docker which port the app listens on
EXPOSE 8000

# Render health-check — hits /health every 30 s after a 60 s warm-up window
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# No --reload in production; uses $PORT injected by Render (default 8000 locally)
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]