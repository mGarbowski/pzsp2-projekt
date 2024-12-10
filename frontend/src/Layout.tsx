import { Link, Outlet } from "react-router-dom";
import styled from '@emotion/styled'
import { GraphVisualisationDemo } from "./Presentation/GraphVisualisationDemo";

export const Layout = () => {
  return (
    <>
      <Nav>
        <NavList>
          <NavElement>
            <NavLink to="/import">Import</NavLink>
          </NavElement>
          <NavElement>
            <NavLink to="/stats">Statystyki</NavLink>
          </NavElement>
        </NavList>
      </Nav>

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

const Nav = styled.nav({
  backgroundColor: "#ed008c",
  fontWeight: "bold",
  padding: "1rem",
})

const NavList = styled.ul({
  listStyleType: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "space-around",
})

const NavElement = styled.a({
  color: "black",
  textDecoration: "none",
  paddingHorizontal: "0.5rem",
  paddingVertical: "0.5rem 1rem",
  display: "block",
})

const NavLink = styled(Link)({
  color: "black",
  textDecoration: "none",
  padding: "0.5rem 1rem",
  display: "block",
  "&:hover": { backgroundColor: "#F0A8D0" }, // TODO: pick this color
});
