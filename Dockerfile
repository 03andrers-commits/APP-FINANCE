# Expo Metro Server for Railway with Health Endpoint
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Create a simple health check server script
RUN cat > health-server.js << 'EOF'
const http = require('http');
const { spawn } = require('child_process');

// Start Expo Metro
const expo = spawn('node_modules/.bin/expo', ['start', '--web', '--port', '8081', '--localhost'], {
  stdio: 'inherit'
});

// Simple health check server on port 3000
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log('Health check server listening on port 3000');
});

process.on('SIGTERM', () => {
  expo.kill();
  server.close();
  process.exit(0);
});
EOF

# Expose ports
EXPOSE 3000 8081

# Set environment
ENV NODE_ENV=production
ENV EXPO_PORT=8081
ENV EXPO_USE_METRO_WORKSPACE_ROOT=1

# Start both servers
CMD ["node", "health-server.js"]
