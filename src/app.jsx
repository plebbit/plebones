import { Route, Routes } from 'react-router-dom'
import Home from './views/home'
import HomeNoModal from './views/home-no-modal'
import Settings from './views/settings'
import Subplebbit from './views/subplebbit'
import Post from './views/post'
import NotFound from './views/not-found'

const commitRef = process?.env?.REACT_APP_COMMIT_REF ? ` ${process.env.REACT_APP_COMMIT_REF.slice(0, 7)}` : ''

const colors = {
  dark1: '#181818',
  dark2: '#212121',
  dark3: '#3d3d3d',
  light1: '#ffffff',
  light2: '#aaaaaa'
}

const Css = () => {
  return (<style>{`
    html, body {
      /* no horizontal scrolling */
      max-width: 100%;
      overflow-x: hidden;
    }

    body {
      margin: 0;
      font-family: verdana, arial, helvetica, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* remove default link styles */
    a {
      color: unset;
      text-decoration: unset;
    }

    .app {
      background-color: ${colors.dark1};
      color: ${colors.light2};
      padding: 0 0.25em;

      /* fix scrolling glitch */
      overflow-y: hidden;

      /* even if app is empty, fill to bottom */
      min-height: 100vh;
    }

    .feed-post {
      padding: 0.25em 0;
    }

    .feed-post .media {
      height: 50vh;
    }

    .post .media {
      max-width: 100vw;
    }

    .reply {
      padding: 0.25em 0;
    }

    .replies {
      margin: 0 0 0 0.5em;
    }
  `}</style>)
}

function App() {
  return (
    <div className="app">
      <Css/>
      {commitRef}
      <Routes>
        <Route exact path="/" element={ <Home/> } />
        <Route exact path="/no-modal" element={ <HomeNoModal/> } />
        <Route exact path="/p/settings" element={ <Settings/> } />
        <Route exact path="/p/:subplebbitAddress" element={ <Subplebbit/> } />
        <Route exact path='/p/:subplebbitAddress/c/:commentCid' element={ <Post/> }/>
        <Route exact path="*" element={ <NotFound/> } />
      </Routes>
    </div>
  )
}

export default App
