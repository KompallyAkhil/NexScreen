# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port 8000 for the FastAPI server`
EXPOSE 8000

# Run the FastAPI server using uvicorn
CMD ["uvicorn", "run:app", "--host", "0.0.0.0", "--port", "8000","--reload"]
