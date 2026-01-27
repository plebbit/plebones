import {spawn} from 'child_process'
import tcpPortUsed from 'tcp-port-used'

const RPC_PORT = 9138
const TIMEOUT_MS = 120000
const POLL_INTERVAL_MS = 2000

const executablePath = process.argv[2]
if (!executablePath) {
  console.error('Usage: node verify-executable.js <path-to-executable>')
  process.exit(1)
}

console.log(`Starting executable: ${executablePath}`)

const childProcess = spawn(executablePath, [], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: process.platform !== 'win32'
})

childProcess.stdout.on('data', (data) => {
  console.log(`[stdout] ${data.toString().trim()}`)
})

childProcess.stderr.on('data', (data) => {
  console.log(`[stderr] ${data.toString().trim()}`)
})

childProcess.on('error', (err) => {
  console.error(`Failed to start executable: ${err.message}`)
  process.exit(1)
})

const killProcess = () => {
  console.log('Killing process...')
  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', childProcess.pid, '/f', '/t'], {stdio: 'inherit'})
    } else {
      process.kill(-childProcess.pid, 'SIGTERM')
      setTimeout(() => {
        try {
          process.kill(-childProcess.pid, 'SIGKILL')
        } catch {}
      }, 5000)
    }
  } catch (err) {
    console.log(`Kill error (may be already dead): ${err.message}`)
  }
}

console.log(`Waiting for RPC server on port ${RPC_PORT} (timeout: ${TIMEOUT_MS / 1000}s)...`)

tcpPortUsed.waitUntilUsed(RPC_PORT, POLL_INTERVAL_MS, TIMEOUT_MS)
  .then(() => {
    console.log(`RPC server is responding on port ${RPC_PORT}`)
    console.log('Verification successful!')
    killProcess()
    setTimeout(() => process.exit(0), 1000)
  })
  .catch((err) => {
    console.error(`Verification failed: ${err.message}`)
    killProcess()
    setTimeout(() => process.exit(1), 1000)
  })
