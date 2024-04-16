import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './lib/init-translations'
import {HashRouter as Router} from 'react-router-dom'
import './index.css'
import './themes.css'
import {App as CapacitorApp} from '@capacitor/app'
import * as serviceWorkerRegistration from './service-worker-registration'
import {setAuthorAvatarsWhitelistedTokenAddresses} from '@plebbit/plebbit-react-hooks'

// add p2p publishing by default
// window.defaultPlebbitOptions = {
//   browserLibp2pJsPublish: true,
//   ipfsGatewayUrls: ['https://ipfs.io', 'https://ipfsgateway.xyz', 'https://cloudflare-ipfs.com', 'https://gateway.plebpubsub.live', 'https://4everland.io'],
//   pubsubHttpClientsOptions: ['https://pubsubprovider.xyz/api/v0', 'https://plebpubsub.live/api/v0', 'https://rannithepleb.com/api/v0'],
//   chainProviders: {
//     eth: {
//       urls: ['ethers.js', 'https://ethrpc.xyz', 'viem'],
//       chainId: 1,
//     },
//     avax: {
//       urls: ['https://api.avax.network/ext/bc/C/rpc'],
//       chainId: 43114,
//     },
//     matic: {urls: ['https://polygon-rpc.com'], chainId: 137},
//   },
//   resolveAuthorAddresses: false,
// }

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
)

// set up PWA https://cra.link/PWA
serviceWorkerRegistration.register()

// add back button in android app
CapacitorApp.addListener('backButton', ({canGoBack}) => {
  if (canGoBack) {
    window.history.back()
  } else {
    CapacitorApp.exitApp()
  }
})

// set whitelisted avatars token addresses
fetch('https://raw.githubusercontent.com/plebbit/temporary-default-subplebbits/master/author-avatars-whitelisted-tokens.json')
  .then((res) => res.json())
  .then((tokens) => setAuthorAvatarsWhitelistedTokenAddresses(tokens.map((token) => token.address)))
  .catch(console.error)
