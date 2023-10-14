import {Link} from 'react-router-dom'
import styles from './menu.module.css'
import {useParams, useNavigate, useLocation} from 'react-router-dom'
import AccountMenu from './account-menu'
import Submit from './submit'
import {useState} from 'react'
import GoToSubplebbitModal from './go-to-subplebbit-modal'
import {useTranslation} from 'react-i18next'
import useTimeFilter from '../../hooks/use-time-filter'

const pages = new Set(['profile', 'settings', 'about', 'inbox', 'u'])
const defaultFeeds = new Set(['all', 'subscriptions'])

const PostMenu = () => {
  const {t} = useTranslation()

  return (
    <div className={styles.menu}>
      <div id="sticky-menu" className={styles.stickyMenu}>
        <span className={styles.leftMenu}></span>
        <span className={styles.rightMenu}>
          <Link to={'/'} className={styles.menuItem}>
            p/all
          </Link>{' '}
          <Link to={'/about'} className={styles.menuItem}>
            {t('about')}
          </Link>
        </span>
      </div>
    </div>
  )
}

const Menu = () => {
  const {timeFilterNames} = useTimeFilter()
  const [goToSubplebbitModalIsOpen, setGoToSubplebbitModalIsOpen] = useState(false)
  const navigate = useNavigate()
  const params = useParams()
  const {pathname, key} = useLocation()
  const pathNames = pathname?.split?.('/')
  // is first page visitor
  const isFirstLocation = key === 'default'

  // dont show menu on post page because it looks ugly
  if (pathNames[1] === 'p' && params.commentCid) {
    // only show menu to first page visitors, because they can't click back to return to feed
    if (!isFirstLocation) {
      return ''
    }
    return <PostMenu />
  }

  const isPage = pages.has(pathNames[1])
  const isCatalog = pathNames[1] === 'catalog' || pathNames[3] === 'catalog'
  const showCatalogLink = !isCatalog && !isPage
  const feedName = pathNames[1] === 'p' ? pathNames[2] : undefined
  const feedLink = createFeedLink(feedName, params.sortType, params.timeFilterName)
  const catalogLink = createCatalogLink(feedName, params.sortType, params.timeFilterName)

  const changeSortType = (event) => {
    const sortType = event.target.value
    const link = isCatalog ? createCatalogLink(feedName, sortType, params.timeFilterName) : createFeedLink(feedName, sortType, params.timeFilterName)
    navigate(link)
  }

  const changeFeedName = (event) => {
    const feedName = event.target.value

    if (feedName === 'goToSubplebbit') {
      return setGoToSubplebbitModalIsOpen(true)
    }

    const link = isCatalog ? createCatalogLink(feedName, params.sortType, params.timeFilterName) : createFeedLink(feedName, params.sortType, params.timeFilterName)
    navigate(link)
  }

  const changeTimeFilter = (event) => {
    const timeFilterName = event.target.value
    const link = isCatalog ? createCatalogLink(feedName, params.sortType, timeFilterName) : createFeedLink(feedName, params.sortType, timeFilterName)
    navigate(link)
  }

  const selectedSortType = params.sortType || (isCatalog ? 'active' : 'hot')
  const selectedFeedName = feedName || ''
  const selectedTimeFilterName = params.timeFilterName || 'all'

  return (
    <div className={styles.menu}>
      <div id="sticky-menu" className={styles.stickyMenu}>
        <span className={styles.leftMenu}></span>

        <span className={styles.rightMenu}>
          <select onChange={changeFeedName} className={[styles.feedName, styles.menuItem].join(' ')} value={selectedFeedName}>
            {isPage || (selectedFeedName && !defaultFeeds.has(selectedFeedName)) ? (
              <option value="">p/{selectedFeedName?.substring(0, 3).toLowerCase() || ''}</option>
            ) : undefined}
            <option value="all">p/all</option>
            <option value="subscriptions">p/subs</option>
            <option value="goToSubplebbit">p/</option>
          </select>{' '}
          <select className={[styles.sortType, styles.menuItem].join(' ')} onChange={changeSortType} value={selectedSortType}>
            <option value="hot">hot</option>
            <option value="new">new</option>
            <option value="topAll">top</option>
            <option value="active">active</option>
            <option value="controversialAll">cont</option>
          </select>{' '}
          <select onChange={changeTimeFilter} className={[styles.feedName, styles.menuItem].join(' ')} value={selectedTimeFilterName}>
            {timeFilterNames.map((timeFilterName) => (
              <option value={timeFilterName}>{timeFilterName}</option>
            ))}
          </select>{' '}
          <Link to={showCatalogLink ? catalogLink : feedLink} className={styles.menuItem}>
            {showCatalogLink ? 'catalog' : 'feed'}
          </Link>{' '}
          <Submit className={styles.menuItem} /> <AccountMenu className={styles.menuItem} />
        </span>

        <GoToSubplebbitModal isOpen={goToSubplebbitModalIsOpen} setIsOpen={setGoToSubplebbitModalIsOpen} />

        <button onClick={() => window.scrollTo(0, 0)} className={styles.scrollToTopButton}>
          top
        </button>
      </div>
    </div>
  )
}

const createFeedLink = (feedName, sortType, timeFilterName) => {
  let feedLink = ''
  if (feedName && feedName !== 'all') {
    feedLink = `/p/${feedName}`
  }
  if (sortType) {
    feedLink += `/${sortType}`
  }
  if (timeFilterName) {
    if (!sortType) {
      feedLink += '/hot'
    }
    feedLink += `/${timeFilterName}`
  }
  if (feedLink === '') {
    feedLink = '/'
  }
  return feedLink
}

const createCatalogLink = (feedName, sortType, timeFilterName) => {
  let catalogLink = '/catalog'
  if (feedName && feedName !== 'all') {
    catalogLink = `/p/${feedName}/catalog`
  }
  if (sortType) {
    catalogLink += `/${sortType}`
  }
  if (timeFilterName) {
    if (!sortType) {
      catalogLink += '/hot'
    }
    catalogLink += `/${timeFilterName}`
  }
  return catalogLink
}

// sticky menu animation
// will trigger more than once with hot reloading during development
if (!window.STICKY_MENU_SCROLL_LISTENER) {
  window.STICKY_MENU_SCROLL_LISTENER = true

  const scrollRange = 50 // the animation css px range in stickyMenuAnimation, must also edit css animation 100%: {top}
  let currentScrollInRange = 0,
    previousScroll = 0
  window.addEventListener('scroll', () => {
    // find difference between current and last scroll position
    const currentScroll = window.scrollY
    const scrollDifference = currentScroll - previousScroll
    previousScroll = currentScroll

    // find new current scroll in range
    const previousScrollInRange = currentScrollInRange
    currentScrollInRange += scrollDifference
    if (currentScrollInRange > scrollRange) {
      currentScrollInRange = scrollRange
    } else if (currentScrollInRange < 0) {
      currentScrollInRange = 0
    }
    // no changes
    if (currentScrollInRange === previousScrollInRange) {
      return
    }

    // control progress of the animation using negative animation-delay (0 to -1s)
    const menuElement = document.getElementById('sticky-menu')
    if (!menuElement) {
      return
    }
    const animationPercent = currentScrollInRange / scrollRange
    menuElement.style.animationDelay = animationPercent * -1 + 's'
  })
}

export default Menu
