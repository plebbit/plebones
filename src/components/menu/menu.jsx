import { Link } from 'react-router-dom'
import styles from './menu.module.css'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import AccountMenu from './account-menu'

const Menu = () => {
  const navigate = useNavigate()
  const params = useParams()
  const pathNames = useLocation()?.pathname?.split?.('/')

  // dont show menu on post page because it looks ugly
  if (params.commentCid) {
    return ''
  }

  const isCatalog = pathNames[1] === 'catalog' || pathNames[3] === 'catalog'
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
  const selectedFeedName = feedName

  return <div className={styles.menu}>
    <span className={styles.leftMenu}></span>

    <span className={styles.rightMenu}>
      <select onChange={changeFeedName} className={[styles.feedName, styles.menuItem].join(' ')} value={selectedFeedName}>
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
      <Link to={!isCatalog ? catalogLink : feedLink} className={styles.menuItem}>{!isCatalog ? 'catalog' : 'feed'}</Link>
      {' '}
      <span className={styles.menuItem}>submit</span>
      {' '}
      <AccountMenu className={styles.menuItem}/>
    </span>
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
