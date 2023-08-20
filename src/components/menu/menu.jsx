import { Link } from 'react-router-dom'
import styles from './menu.module.css'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import AccountMenu from './account-menu'
import Submit from './submit'

const pages = new Set(['profile', 'settings', 'about', 'inbox', 'u'])
const defaultFeeds = new Set(['all', 'subscriptions'])

const PostMenu = () => {
  return <div className={styles.menu}>
    <span className={styles.leftMenu}></span>
    <span className={styles.rightMenu}>
      <Link to={'/'} className={styles.menuItem}>p/all</Link>
      {' '}
      <Link to={'/about'} className={styles.menuItem}>about</Link>
    </span>
  </div>
}

const Menu = () => {
  const navigate = useNavigate()
  const params = useParams()
  const {pathname, key} = useLocation()
  const pathNames = pathname?.split?.('/')
  const isFirstLocation = key === 'default'

  // dont show menu on post page because it looks ugly
  if (pathNames[1] === 'p' && params.commentCid) {
    // users who clicked on a post can click back button, don't need a manu
    if (!isFirstLocation) {
      return ''
    }
    return <PostMenu />
  }

  const isPage = pages.has(pathNames[1])
  const isCatalog = pathNames[1] === 'catalog' || pathNames[3] === 'catalog'
  const showCatalogLink = !isCatalog && !isPage
  const feedName = pathNames[1] === 'p' ? pathNames[2] : undefined
  const feedLink = createFeedLink(feedName, params.sortType)
  const catalogLink = createCatalogLink(feedName, params.sortType)

  const changeSortType = (event) => {
    const sortType = event.target.value
    const link = isCatalog ? createCatalogLink(feedName, sortType) : createFeedLink(feedName, sortType)
    navigate(link)
  }

  const changeFeedName = (event) => {
    const feedName = event.target.value
    const link = isCatalog ? createCatalogLink(feedName, params.sortType) : createFeedLink(feedName, params.sortType)
    navigate(link)
  }

  const selectedSortType = params.sortType || (isCatalog ? 'active' : 'hot')
  const selectedFeedName = feedName || ''

  return <div className={styles.menu}>
    <span className={styles.leftMenu}></span>

    <span className={styles.rightMenu}>
      <select onChange={changeFeedName} className={[styles.feedName, styles.menuItem].join(' ')} value={selectedFeedName}>
        {isPage || (selectedFeedName && !defaultFeeds.has(selectedFeedName)) ? <option value="">p/{selectedFeedName?.substring(0, 3).toLowerCase() || ''}</option> : undefined}
        <option value="all">p/all</option>
        <option value="subscriptions">p/subs</option>
      </select>
      {' '}
      <select className={[styles.sortType, styles.menuItem].join(' ')}  onChange={changeSortType} value={selectedSortType}>
        <option value="hot">hot</option>
        <option value="new">new</option>
        <option value="topAll">top</option>
        <option value="active">active</option>
        <option value="controversialAll">cont</option>
      </select>
      {' '}
      <Link to={showCatalogLink ? catalogLink : feedLink} className={styles.menuItem}>{showCatalogLink ? 'catalog' : 'feed'}</Link>
      {' '}
      <Submit className={styles.menuItem}/>
      {' '}
      <AccountMenu className={styles.menuItem}/>
    </span>
    <button onClick={() => window.scrollTo(0,0)} className={styles.scrollToTopButton}>top</button>
  </div>
}

const createFeedLink = (feedName, sortType) => {
  let feedLink = ''
  if (feedName && feedName !== 'all') {
    feedLink = `/p/${feedName}`
  }
  if (sortType) {
    feedLink += `/${sortType}`
  }
  if (feedLink === '') {
    feedLink = '/'
  }
  return feedLink
}

const createCatalogLink = (feedName, sortType) => {
  let catalogLink = '/catalog'
  if (feedName && feedName !== 'all') {
    catalogLink = `/p/${feedName}/catalog`
  }
  if (sortType) {
    catalogLink += `/${sortType}`
  }
  return catalogLink
}

export default Menu
