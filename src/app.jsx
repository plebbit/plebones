import { Route, Routes } from 'react-router-dom'
import Home from './views/home'
import TextOnly from './views/text-only'
import Catalog from './views/catalog'
import Board from './views/board'
import Settings from './views/settings'
import Subplebbit from './views/subplebbit'
import Post from './views/post'
import NotFound from './views/not-found'
import styles from './app.module.css'
import useTheme from './hooks/use-theme'
import {useEffect} from 'react'
const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : ''

function App() {
  const [theme] = useTheme()

  // add theme className to body so it can set the correct body background in index.css
  useEffect(() => {
    document.body.classList.forEach(className => document.body.classList.remove(className))
    document.body.classList.add(theme)
  }, [theme])

  return (
    <div className={[styles.app, theme].join(' ')}>
      <div className={styles.commitRef}>{commitRef}</div>
      <Routes>
        <Route path="/:sortType?" element={ <Home/> } />
        <Route path="/text-only/:sortType?" element={ <TextOnly/> } />
        <Route path="/catalog/:sortType?" element={ <Catalog /> } />
        <Route path="/board/:sortType?" element={ <Board /> } />
        <Route path="/p/settings" element={ <Settings/> } />
        <Route path="/p/:subplebbitAddress/:sortType?" element={ <Subplebbit/> } />
        <Route path='/p/:subplebbitAddress/c/:commentCid' element={ <Post/> }/>
        <Route path="*" element={ <NotFound/> } />
      </Routes>
    </div>
  )
}

export default App
