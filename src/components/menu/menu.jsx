import { Link } from 'react-router-dom'
import styles from './menu.module.css'
import {useParams} from 'react-router-dom'

const Menu = () => {
  const {commentCid} = useParams()

  // dont show menu on post page because it looks ugly
  if (commentCid) {
    return ''
  }

  return <div className={styles.menu}>
    <select name="sortType">
      <option value="hot">hot</option>
      <option value="new">new</option>
      <option value="topAll">top</option>
      <option value="active">active</option>
      <option value="controversialAll">controversial</option>
    </select>
    {' '}
    <Link to='/catalog' className={styles.title}>catalog</Link>
    {' '}
    settings
  </div>
}

export default Menu
