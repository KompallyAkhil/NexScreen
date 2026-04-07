# Use Node.js 20 on Alpine Linux for a small footprint
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first to leverage Docker layer caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy all local project files to the container
COPY . .

# Expose Next.js default port
EXPOSE 3000

# Next.js development server
CMD ["npm", "run", "dev"]
