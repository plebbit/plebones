import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // a lot of dependencies need node polyfills
    nodePolyfills(),

    // set up pwa / service worker
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        short_name: 'plebones',
        name: 'plebones',
        icons: [
          {
            src: 'manifest-icon-192x192.png',
            type: 'image/png',
            sizes: '192x192'
          },
          {
            src: 'manifest-icon-512x512.png',
            type: 'image/png',
            sizes: '512x512'
          }
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#aaaaaa'
      },
      workbox: {
        navigateFallback: 'index.html',
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10mb
        runtimeCaching: [
          // cache the entire react app
          {
            urlPattern: ({url}) => url.origin === self.location.origin,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'everything-react-app-cache',
              expiration: {
                maxEntries: 500,
                // never expire the cache in case server goes down
                maxAgeSeconds: undefined
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    })
  ],

  // electron uses file:// urls, so need base ./
  base: './',

  build: {
    // usually vite uses 'dist', but we want to use 'dist' for electron
    outDir: 'build',

    // don't include sourcemap in the electron app or ipfs build
    sourcemap: process.env.GENERATE_SOURCEMAP === 'true' ? true : undefined,

    // try to support as old browsers as possible
    target: [
      'chrome67',
      'edge79',
      'firefox68',
      'opera54',
      'safari14'
    ]
  }
})
