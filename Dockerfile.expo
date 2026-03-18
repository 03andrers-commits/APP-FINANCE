# Expo Metro Server Dockerfile for Railway
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port for Expo Metro
EXPOSE 8081

# Set environment variables
ENV EXPO_USE_METRO_WORKSPACE_ROOT=1
ENV NODE_ENV=production
ENV EXPO_PORT=8081

# Start Expo Metro server
CMD ["npx", "expo", "start", "--web", "--port", "8081"]
