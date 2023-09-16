import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './lib/init-translations'
import {HashRouter as Router} from 'react-router-dom'
import './index.css'
import './themes.css'
import {App as CapacitorApp} from '@capacitor/app'
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

// add back button in android app
CapacitorApp.addListener('backButton', ({canGoBack}) => {
  if (canGoBack) {
    window.history.back()
  } else {
    CapacitorApp.exitApp()
  }
})
