import { Link, Outlet } from "react-router-dom";
import styled from '@emotion/styled'
import { GraphVisualisationDemo } from "./Presentation/GraphVisualisationDemo";
import { ModeToggle } from "./components/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./components/ui/navigation-menu"

export const Layout = () => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row">
              <NavigationMenuItem>
                <Link to="/import">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Import
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/stats">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Statystyki
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/add-channel">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Dodaj kanał
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </div>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </div>
        </NavigationMenuList>
      </NavigationMenu >


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

const NavList = styled.ul({
  listStyleType: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  justifyContent: "space-around",
})

const NavElement = styled.a({
  textDecoration: "none",
  paddingHorizontal: "0.5rem",
  paddingVertical: "0.5rem 1rem",
  display: "block",
})

const NavLink = styled(Link)({
  textDecoration: "none",
  padding: "0.5rem 1rem",
  display: "block",
  "&:hover": { color: "#555" }, // TODO: pick this color
});
