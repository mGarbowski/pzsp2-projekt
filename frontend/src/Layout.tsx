import { Link, Outlet } from "react-router-dom";
import styles from './Layout.module.css';
import styled from '@emotion/styled'
import { GraphVisualisationDemo } from "./Presentation/GraphVisualisationDemo";

export const Layout = () => {
  return (
    <>
      <nav className={styles.nav}>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <Link to="/" className={styles.a}>Home</Link>
          </li>
          <li className={styles.li}>
            <Link to="/import" className={styles.a}>Import</Link>
          </li>
          <li className={styles.li}>
            <Link to="/optimizer" className={styles.a}>Optimizer</Link>
          </li>
          <li className={styles.li}>
            <Link to="/presentation" className={styles.a}>Presentation</Link>
          </li>
        </ul>
      </nav>

      <MainContainer>
        <ContentContainer>
          <Outlet />
        </ContentContainer>
        <ContentContainer>
          <GraphVisualisationDemo />
        </ContentContainer>
      </MainContainer>
    </>
  )
};

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
  paddingHorizontal: '500px',
})

const ContentContainer = styled.div({
  flex: 1,
  overflow: "auto",
})
