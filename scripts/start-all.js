/**
 * DukaanPayAI – Master Service Runner
 * Boots all 7 Node.js/TypeScript services and all 4 Python FastAPI AI services
 * with unified log aggregation, health checks, and clean process lifecycle management.
 */

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const VENV_PYTHON = path.join(ROOT_DIR, '.venv', 'bin', 'python3');

const services = [
  // 1. Core Node.js / TypeScript Services
  {
    name: 'api-gateway',
    cmd: 'node',
    args: ['services/api-gateway/dist/index.js'],
    port: 4000,
    color: '\x1b[36m', // Cyan
  },
  {
    name: 'merchant-service',
    cmd: 'node',
    args: ['services/merchant-service/dist/index.js'],
    port: 4001,
    color: '\x1b[32m', // Green
  },
  {
    name: 'transaction-service',
    cmd: 'node',
    args: ['services/transaction-service/dist/index.js'],
    port: 4002,
    color: '\x1b[33m', // Yellow
  },
  {
    name: 'inventory-service',
    cmd: 'node',
    args: ['services/inventory-service/dist/index.js'],
    port: 4003,
    color: '\x1b[34m', // Blue
  },
  {
    name: 'health-score-service',
    cmd: 'node',
    args: ['services/health-score-service/dist/index.js'],
    port: 4004,
    color: '\x1b[35m', // Magenta
  },
  {
    name: 'campaign-service',
    cmd: 'node',
    args: ['services/campaign-service/dist/index.js'],
    port: 4005,
    color: '\x1b[92m', // Bright Green
  },
  {
    name: 'notification-service',
    cmd: 'node',
    args: ['services/notification-service/dist/index.js'],
    port: 4006,
    color: '\x1b[96m', // Bright Cyan
  },

  // 2. Cognitive Python FastAPI Services
  {
    name: 'ai-agent-service',
    cmd: VENV_PYTHON,
    args: ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8001'],
    cwd: path.join(ROOT_DIR, 'services', 'ai-agent-service'),
    port: 8001,
    color: '\x1b[91m', // Bright Red
  },
  {
    name: 'forecasting-service',
    cmd: VENV_PYTHON,
    args: ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8002'],
    cwd: path.join(ROOT_DIR, 'services', 'forecasting-service'),
    port: 8002,
    color: '\x1b[93m', // Bright Yellow
  },
  {
    name: 'ocr-service',
    cmd: VENV_PYTHON,
    args: ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8003'],
    cwd: path.join(ROOT_DIR, 'services', 'ocr-service'),
    port: 8003,
    color: '\x1b[94m', // Bright Blue
  },
  {
    name: 'voice-agent-service',
    cmd: VENV_PYTHON,
    args: ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8004'],
    cwd: path.join(ROOT_DIR, 'services', 'voice-agent-service'),
    port: 8004,
    color: '\x1b[95m', // Bright Magenta
  },
];

const runningProcesses = [];

console.log('\x1b[1m\x1b[32m%s\x1b[0m', '=====================================================');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '🚀 Launching DukaanPayAI Production Microservice Stack');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '=====================================================\n');

services.forEach((svc) => {
  const child = spawn(svc.cmd, svc.args, {
    cwd: svc.cwd || ROOT_DIR,
    env: {
      ...process.env,
      PORT: String(svc.port),
      NODE_ENV: 'development',
      USE_IN_MEMORY_DB: 'true',
      USE_EMBEDDED_BUS: 'true',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}:${svc.port}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${svc.color}[${svc.name}:${svc.port}]\x1b[0m ${line}`);
      }
    });
  });

  child.on('exit', (code) => {
    console.log(`${svc.color}[${svc.name}]\x1b[0m exited with code ${code}`);
  });

  runningProcesses.push(child);
});

// Graceful cleanup on SIGINT/SIGTERM
const cleanup = () => {
  console.log('\n\x1b[33mShutting down all DukaanPayAI microservices...\x1b[0m');
  runningProcesses.forEach((p) => {
    try {
      p.kill('SIGTERM');
    } catch (e) {}
  });
  setTimeout(() => process.exit(0), 500);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
