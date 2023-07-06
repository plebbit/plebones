import { Route, Routes } from 'react-router-dom'
// import Home from './views/home'
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
  light1: '#f1f1f1',
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
      font-size: 10px;

      /* fix scroll too fast white flash */
      background-color: ${colors.dark1};
    }

    /* remove default link styles */
    a {
      color: unset;
      text-decoration: unset;
    }

    .app {
      background-color: ${colors.dark1};
      color: ${colors.light2};
      padding: 0 2px;

      /* fix scrolling glitch */
      overflow-y: hidden;

      /* even if app is empty, fill to bottom */
      min-height: 100vh;
    }

    .feed-post {
      padding: 2px 0;
    }

    .feed-post .text-wrapper, .post .text-wrapper {
      /* put score in left column */
      display: flex; 
      flex-direction: row;
    }

    .feed-post .score, .post .score {
      font-size: 13px;
      padding: 0 2px 0 0;

      /* fix the arrow positions */
      transform: translateY(-8px);
      text-align: center;
      height: 0;
    }

    .downvote {
      /* fix the arrow positions */
      transform: scaleY(0.5) translateY(-50%);
    }

    .upvote {
      /* fix the arrow positions */
      transform: scaleY(0.5) translateY(50%);
    }

    .feed-post .media {
      height: 50vh;
    }

    .feed-post .title, .post .title {
      color: ${colors.light1};
      font-size: 16px;
    }

    .feed-post .footer, .post .footer {
      font-weight: bold;
    }

    .post .media {
      max-width: 100vw;
    }

    .media-wrapper {
      background-color: #161616;
    }

    .reply {
      padding: 0 0 2px 0;
    }

    .reply .score {
      font-size: 10px;
    }

    .reply .downvote, .reply .upvote {
      display: inline-block;
      /* fix the arrow positions */
      height: 0px;
      transform: scaleY(0.5) translateY(6px);
    }

    .reply .header, .reply .score {
      display: inline;
    }

    .replies {
      margin: 0 0 0 4px;
    }

    .commit-ref {
      position: absolute;
      right: 0;
      font-size: 10px;
      color: ${colors.dark3};
    }
  `}</style>)
}

function App() {
  return (
    <div className="app">
      <Css/>
      <div className='commit-ref'>{commitRef}</div>
      <Routes>
        <Route exact path="/" element={ <HomeNoModal/> } />
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
