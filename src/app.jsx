import {Route, Routes, Outlet} from 'react-router-dom'
import Home from './views/home'
import HomeModal from './views/home-modal'
import Subscriptions from './views/subscriptions'
import SubscriptionsCatalog from './views/subscriptions-catalog'
import TextOnly from './views/text-only'
import Catalog from './views/catalog'
import Board from './views/board'
import Settings from './views/settings'
import Subplebbit from './views/subplebbit'
import SubplebbitCatalog from './views/subplebbit-catalog'
import Post from './views/post'
import PendingPost from './views/pending-post'
import NotFound from './views/not-found'
import Profile from './views/profile'
import About from './views/about'
import Inbox from './views/inbox'
import Author from './views/author'
import {useAccount} from '@plebbit/plebbit-react-hooks'

import styles from './app.module.css'
import useTheme from './hooks/use-theme'
import {useEffect} from 'react'
import Menu from './components/menu'
import ChallengeModal from './components/challenge-modal'

function App() {
  const [theme] = useTheme()

  // add theme className to body so it can set the correct body background in index.css
  useEffect(() => {
    document.body.classList.forEach((className) => document.body.classList.remove(className))
    document.body.classList.add(theme)
  }, [theme])

  // add notification count to title
  const unreadNotificationCount = useAccount()?.unreadNotificationCount
  useEffect(() => {
    if (unreadNotificationCount) document.title = `(${unreadNotificationCount}) plebones`
    else document.title = 'plebones'
  }, [unreadNotificationCount])

  const layout = (
    <div>
      <ChallengeModal />
      <Menu />
      <Outlet />
    </div>
  )

  return (
    <div className={[styles.app, theme].join(' ')}>
      <Routes>
        <Route element={layout}>
          {/* post page */}
          <Route path="/p/:subplebbitAddress/c/:commentCid" element={<Post />} />

          {/* feed pages */}
          <Route path="/:sortType?" element={<Home />} />
          <Route path="/catalog/:sortType?" element={<Catalog />} />
          <Route path="/p/subscriptions/catalog/:sortType?" element={<SubscriptionsCatalog />} />
          <Route path="/p/subscriptions/:sortType?" element={<Subscriptions />} />

          {/* subplebbit pages */}
          <Route path="/p/:subplebbitAddress/catalog/:sortType?" element={<SubplebbitCatalog />} />
          <Route path="/p/:subplebbitAddress/:sortType?" element={<Subplebbit />} />

          {/* profile and settings pages */}
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:accountCommentIndex" element={<PendingPost />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />

          {/* author post history page */}
          <Route path="/u/:authorAddress/c/:commentCid?" element={<Author />} />

          {/* examples and experimental pages */}
          <Route path="/modal/:sortType?" element={<HomeModal />} />
          <Route path="/modal/p/:subplebbitAddress/c/:commentCid" element={<HomeModal />} />
          <Route path="/text-only/:sortType?" element={<TextOnly />} />
          <Route path="/board/:sortType?" element={<Board />} />

          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
