import { Route, Switch } from 'react-router-dom'
import Home from './views/home'
import Settings from './views/settings'
import Subplebbit from './views/subplebbit'
import Post from './views/post'
import NotFound from './views/not-found'

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
  `}</style>)
}

function App() {
  return (
    <div className="app">
      <Css/>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/p/settings" component={ Settings } />
        <Route exact path="/p/:subplebbitAddress" component={ Subplebbit } />
        <Route exact path='/p/:subplebbitAddress/c/:commentCid' component={ Post }/>
        <Route exact path="*" component={ NotFound } />
      </Switch>
    </div>
  )
}

export default App
