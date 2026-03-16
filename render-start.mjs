import { spawn } from 'child_process';
import http from 'http';

// 1. Criar um servidor HTTP simples para o Render não matar o processo
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Expo Metro Server is Running!\n');
});

server.listen(PORT, () => {
  console.log(`✅ Keep-alive server listening on port ${PORT}`);
});

// 2. Iniciar o Expo Metro em modo Tunnel
console.log('🚀 Starting Expo Metro with Tunnel...');

const expoProcess = spawn('npx', ['expo', 'start', '--tunnel'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, EXPO_NO_INTERACTIVE: '1' }
});

expoProcess.on('error', (err) => {
  console.error('❌ Failed to start Expo:', err);
});

expoProcess.on('close', (code) => {
  console.log(`🛑 Expo process exited with code ${code}`);
  process.exit(code);
});
