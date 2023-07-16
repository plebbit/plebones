import { Link } from 'react-router-dom'
import styles from './menu.module.css'

const Menu = () => {
  return <div className={styles.menu}>
    <select name="sortType">
      <option value="hot">h - hot</option>
      <option value="new" selected>n - new</option>
      <option value="topAll">t - top</option>
      <option value="active">a - active</option>
      <option value="controversialAll">c - controversial</option>
    </select>
    {' '}
    <Link to='/catalog' className={styles.title}>c</Link>
    {'  '}
    s
  </div>
}

export default Menu
