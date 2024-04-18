import {
  Link,
  LinkProps,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppContext, RouterContext } from "../App";
import {
  BeakerIcon as BeakerOutlinedIcon,
  HomeIcon as HomeOutlinedIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { BeakerIcon, HomeIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "react-tooltip";
import { useContext } from "react";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const { theme, setTheme } = useContext(AppContext);

  return (
    <div className="flex h-screen">
      {/* Todo: Create Better Nav Header */}
      <div className="flex flex-col items-center bg-neutral-200 py-6 shadow-md dark:bg-neutral-800">
        <StyledLink
          to="/"
          params={{}}
          search={{}}
          data-tooltip-id="home-icon-tooltip"
          data-tooltip-content={"Home"}
          data-tooltip-delay-show={500}
        >
          {({ isActive }) =>
            isActive ? (
              <HomeIcon className="h-6 w-6" />
            ) : (
              <HomeOutlinedIcon className="h-6 w-6" />
            )
          }
        </StyledLink>
        <StyledLink
          to="/simulations"
          params={{}}
          search={{}}
          data-tooltip-id="simulations-icon-tooltip"
          data-tooltip-content={"Simulations List"}
          data-tooltip-delay-show={500}
        >
          {({ isActive }) =>
            isActive ? (
              <BeakerIcon className="h-6 w-6" />
            ) : (
              <BeakerOutlinedIcon className="h-6 w-6" />
            )
          }
        </StyledLink>
        <button
          className="mt-auto text-neutral-800 dark:text-neutral-200"
          onClick={(e) => {
            e.preventDefault();
            if (!theme || theme === "dark") {
              localStorage.setItem("graph-theme", "light");
              setTheme("light");
            } else {
              localStorage.setItem("graph-theme", "dark");
              setTheme("dark");
            }
          }}
          data-tooltip-id="dark-light-mode-tooltip"
          data-tooltip-content="Toggle Light or Dark Mode"
          data-tooltip-delay-show={1000}
        >
          {!theme || theme === "dark" ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </button>
        <Tooltip id="dark-light-mode-tooltip" />
        <Tooltip id="home-icon-tooltip" />
        <Tooltip id="simulations-icon-tooltip" />
      </div>
      <div className="flex flex-1 overflow-y-auto dark:bg-neutral-900">
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools />
      <ReactQueryDevtools /> */}
    </div>
  );
}

function StyledLink(props: LinkProps) {
  return (
    <Link
      {...props}
      className={
        "px-3 py-3 text-neutral-800 transition-colors duration-500 ease-in-out dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 " +
        props.className
      }
      activeProps={{
        className:
          "text-blue-500 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-500",
      }}
      activeOptions={{ exact: false, includeHash: true, includeSearch: true }}
    >
      {props.children}
    </Link>
  );
}
