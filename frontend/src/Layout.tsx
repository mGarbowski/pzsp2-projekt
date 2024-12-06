import {Link, Outlet} from "react-router-dom";
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link to="/" className={styles.a}>Home</Link>
          </li>
          <li className={styles.li}>
            <Link to="/optimizer" className={styles.a}>Optimizer</Link>
          </li>
          <li className={styles.li}>
            <Link to="/presentation" className={styles.a}>Presentation</Link>
          </li>
        </ul>
      </nav>

      <Outlet/>
    </>
  )
};