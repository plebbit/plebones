import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './app'
import './lib/init-translations'
import {HashRouter as Router} from 'react-router-dom'
import './index.css'
import './themes.css'
import {App as CapacitorApp} from '@capacitor/app'
import {setAuthorAvatarsWhitelistedTokenAddresses} from '@plebbit/plebbit-react-hooks'

// set up libp2pjs as default
// window.defaultPlebbitOptions = {libp2pJsClientsOptions: [{key: 'libp2pjs'}]}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
)

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
