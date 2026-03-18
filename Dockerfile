# Expo Metro Server for Railway
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 8081

# Set environment
ENV NODE_ENV=production
ENV EXPO_PORT=8081
ENV EXPO_USE_METRO_WORKSPACE_ROOT=1

# Start Expo Metro
CMD ["node_modules/.bin/expo", "start", "--web", "--port", "8081", "--localhost"]
