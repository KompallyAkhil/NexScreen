
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
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port $PORT"]