import { Link } from 'react-router-dom'
import styles from './menu.module.css'
import {useParams, useMatch, useNavigate} from 'react-router-dom'
import AccountMenu from './account-menu'

const Menu = () => {
  const params = useParams()
  const isCatalogSortType = useMatch('/catalog/:sortType')
  const isCatalog = useMatch('/catalog') || isCatalogSortType
  const navigate = useNavigate()

  // dont show menu on post page because it looks ugly
  if (params.commentCid) {
    return ''
  }

  let catalogLink = '/catalog'
  let feedLink = '/'
  if (params.sortType) {
    catalogLink += `/${params.sortType}`
    feedLink += params.sortType
  }

  const changeSortType = (event) => {
    const sortType = event.target.value
    let link = `/${sortType}`
    if (isCatalog) {
      link = `/catalog${link}`
    }
    navigate(link)
  }

  const selectedSortType = params.sortType || (isCatalog ? 'active' : 'hot')

  return <div className={styles.menu}>
    <select className={styles.sortType}  onChange={changeSortType} value={selectedSortType}>
      <option value="hot">hot</option>
      <option value="new">new</option>
      <option value="topAll">top</option>
      <option value="active">active</option>
      <option value="controversialAll">cont</option>
    </select>
    {' '}
    <Link to={!isCatalog ? catalogLink : feedLink} className={styles.title}>{!isCatalog ? 'catalog' : 'feed'}</Link>
    {' '}
    <span>submit</span>
    {' '}
    <AccountMenu />
  </div>
}

export default Menu
