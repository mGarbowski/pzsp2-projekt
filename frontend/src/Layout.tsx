import { Link, Outlet } from "react-router-dom";
import styled from '@emotion/styled'
import { GraphVisualisationDemo } from "./Presentation/GraphVisualisationDemo";
import { ModeToggle } from "./Components/modeToggle.tsx";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./Components/UI/navigationMenu.tsx"

export const Layout = () => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          <div className="flex w-full justify-between ml-2">
            <div className="flex flex-row w-full">
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
            <div className="mr-2">
              <NavigationMenuItem>
                <ModeToggle />
              </NavigationMenuItem>
            </div>
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
