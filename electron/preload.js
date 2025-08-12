const {contextBridge, ipcRenderer} = require('electron') // electron preload can't use import

// dev uses http://localhost, prod uses file://...index.html
const isDev = window.location.protocol === 'http:'

const defaultPlebbitOptions = {
  plebbitRpcClientsOptions: ['ws://localhost:9138'],
}

contextBridge.exposeInMainWorld('defaultPlebbitOptions', defaultPlebbitOptions)
// plebbit doesn't run the ipfs dht, nfts are only seeded using ipfs dht, so can't use localhost
// contextBridge.exposeInMainWorld('defaultMediaIpfsGatewayUrl', 'http://localhost:6473')

// receive plebbit rpc auth key from main
ipcRenderer.on('plebbit-rpc-auth-key', (event, plebbitRpcAuthKey) => contextBridge.exposeInMainWorld('plebbitRpcAuthKey', plebbitRpcAuthKey))
ipcRenderer.send('get-plebbit-rpc-auth-key')

// uncomment for logs
// localStorage.debug = 'plebbit-js:*,plebbit-react-hooks:*,plebones:*'
