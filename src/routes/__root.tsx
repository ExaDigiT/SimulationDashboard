import {
  Link,
  LinkProps,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterContext } from "../App";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  return (
    <div className="flex flex-col h-screen">
      {/* Todo: Create Better Nav Header */}
      <header className="bg-neutral-800 px-12 py-2 flex gap-4 shadow-md">
        <StyledLink to="/" params={{}}>
          Home
        </StyledLink>
        <StyledLink to="/simulations" params={{}}>
          Simulations
        </StyledLink>
      </header>
      <div className="flex-1 flex overflow-y-auto">
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
