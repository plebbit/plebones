import { Route, Routes } from 'react-router-dom'
import Home from './views/home'
import Catalog from './views/catalog'
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

    .feed-post, .post {
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
      transform: translateY(-9.5px);
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

      /* undo the app post padding */
      margin: 0 0 0 -2px;
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

      /* undo the app post padding */
      margin: 0 0 0 -2px;
    }

    /* make it darker so user knows a media is loading */
    .media-wrapper {
      background-color: #161616;
    }

    .reply .score {
      font-size: 10px;
    }

    .reply .content {
      font-size: 13px;
    }

    .reply .downvote, .reply .upvote {
      display: inline-block;
      /* fix the arrow positions */
      height: 0px;
      transform: scaleY(0.5) translateY(6.5px);
    }

    .reply .header, .reply .score {
      display: inline;
    }

    /* add indent to each nested reply */
    .replies {
      padding: 0 0 0 4px;
    }

    /* the first replies should have no indent */
    .post > .replies {
      padding: 0;
    }

    /* each top level reply should have a space after */
    .post > .replies > .reply {
      padding: 0 0 2px 0;
    }

    /* empty space between title and replies when there is no media */
    .post .no-media {
      height: 2px
    }

    .catalog-row {
      display: flex; 
      flex-direction: row;
    }

    /* if less than 4 columns (180 * 4) catalog should be centered */
    @media (max-width: 720px) {
      .catalog-row {
        justify-content: center;
      }
    }

    .catalog-post {
      width: 180px;
      font-size: 11px;

      /* fix text overflowing */
      overflow: hidden;
    }

    .catalog-post .stats {
      font-weight: bold;
    }

    .catalog-post .media {
      height: 180px;
    }

    /* media and no media must be the same height, or the infinite scroll bugs out */
    .catalog-post .media-wrapper, .catalog-post .no-media {
      overflow: hidden;
      width: 180px;
      height: 180px;
    }

    .commit-ref {
      position: absolute;
      right: 0;
      bottom: 0;
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
        <Route path="/:sortType?" element={ <Home/> } />
        <Route path="/catalog/:sortType?" element={ <Catalog /> } />
        <Route path="/p/settings" element={ <Settings/> } />
        <Route path="/p/:subplebbitAddress/:sortType?" element={ <Subplebbit/> } />
        <Route path='/p/:subplebbitAddress/c/:commentCid' element={ <Post/> }/>
        <Route path="*" element={ <NotFound/> } />
      </Routes>
    </div>
  )
}

export default App
