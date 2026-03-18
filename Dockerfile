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

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8081', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start Expo Metro
CMD ["npx", "expo", "start", "--web", "--port", "8081", "--localhost"]
