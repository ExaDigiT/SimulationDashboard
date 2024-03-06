import {
  Link,
  LinkProps,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterContext } from "../App";
import { BeakerIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  return (
    <div className="flex h-screen">
      {/* Todo: Create Better Nav Header */}
      <div className="bg-neutral-800 px-3 py-6 flex gap-6 shadow-md flex-col">
        <StyledLink
          to="/"
          params={{}}
          data-tooltip-id="home-icon-tooltip"
          data-tooltip-content={"Home"}
          data-tooltip-delay-show={500}
        >
          <HomeIcon className="h-6 w-6" />
        </StyledLink>
        <StyledLink
          to="/simulations"
          params={{}}
          data-tooltip-id="simulations-icon-tooltip"
          data-tooltip-content={"Simulations List"}
          data-tooltip-delay-show={500}
        >
          <BeakerIcon className="h-6 w-6" />
        </StyledLink>
        <Tooltip id="home-icon-tooltip" />
        <Tooltip id="simulations-icon-tooltip" />
      </div>
      <div className="flex-1 flex overflow-y-auto bg-neutral-900">
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
        "text-white hover:text-neutral-300 transition-colors ease-in-out duration-500 " +
        props.className
      }
    >
      {props.children}
    </Link>
  );
}
