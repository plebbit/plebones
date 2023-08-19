import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { HashRouter as Router } from 'react-router-dom'
import './index.css'
import './themes.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import PlebbitJs from '@plebbit/plebbit-js'
// inject native functions into renderer
// https://github.com/plebbit/plebbit-js/blob/master/docs/cross-platform-native-functions.md
if (window.plebbitJsNativeFunctions) {
  PlebbitJs.setNativeFunctions(window.plebbitJsNativeFunctions)
}

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
