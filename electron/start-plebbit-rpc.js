const tcpPortUsed = require('tcp-port-used')
const {PlebbitWsServer} = require('@plebbit/plebbit-js/rpc')
const path = require('path')
const envPaths = require('env-paths').default('plebbit', { suffix: false });

let isDev = true
try {
  isDev = require('electron-is-dev')
} catch (e) {}

//           PLEB, always run plebbit rpc on this port so all clients can use it
const port = 9138
const defaultPlebbitOptions = {
  // find the user's OS data path
  dataPath: !isDev ? envPaths.data : path.join(__dirname, '..', '.plebbit'),
  ipfsHttpClientsOptions: ['http://localhost:5001/api/v0'],
  // TODO: having to define pubsubHttpClientsOptions and ipfsHttpClientsOptions is a bug with plebbit-js
  pubsubHttpClientsOptions: ['http://localhost:5001/api/v0'],
}

let pendingStart = false
const start = async () => {
  if (pendingStart) {
    return
  }
  pendingStart = true
  try {
    const started = await tcpPortUsed.check(port, '127.0.0.1')
    if (started) {
      return
    }
    const plebbitWebSocketServer = await PlebbitWsServer({port, plebbitOptions: defaultPlebbitOptions})
    console.log(`plebbit rpc: listening on port ${port}`)
    plebbitWebSocketServer.ws.on('connection', (socket, request) => {
      console.log('plebbit rpc: new connection')
      // debug raw JSON RPC messages in console
      // if (isDev) {
        socket.on('message', (message) => console.log(`plebbit rpc: ${message.toString()}`))
      // }
    })
  }
  catch (e) {
    console.log('failed starting plebbit rpc server', e)
  }
  pendingStart = false
}

// retry starting the plebbit rpc server every 1 second, 
// in case it was started by another client that shut down and shut down the server with it
start()
setInterval(() => {
  start()
}, 1000)