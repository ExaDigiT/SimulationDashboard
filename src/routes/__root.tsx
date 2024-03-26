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
  BeakerIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
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
      <div className="bg-neutral-200 dark:bg-neutral-800 px-3 py-6 flex gap-6 shadow-md flex-col">
        <StyledLink
          to="/"
          params={{}}
          search={{}}
          data-tooltip-id="home-icon-tooltip"
          data-tooltip-content={"Home"}
          data-tooltip-delay-show={500}
        >
          <HomeIcon className="h-6 w-6" />
        </StyledLink>
        <StyledLink
          to="/simulations"
          params={{}}
          search={{}}
          data-tooltip-id="simulations-icon-tooltip"
          data-tooltip-content={"Simulations List"}
          data-tooltip-delay-show={500}
        >
          <BeakerIcon className="h-6 w-6" />
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
      <div className="flex-1 flex overflow-y-auto dark:bg-neutral-900">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </div>
  );
}

function StyledLink(props: LinkProps) {
  return (
    <Link
      {...props}
      className={
        "text-neutral-800 dark:text-neutral-200 dark:hover:text-neutral-300 transition-colors ease-in-out duration-500 " +
        props.className
      }
    >
      {props.children}
    </Link>
  );
}
