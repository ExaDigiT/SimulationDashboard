import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <>
      {/* Todo: Create Better Nav Header */}
      <header className="bg-slate-600 px-12 py-2 flex gap-2">
        <Link to="/">Home</Link>
        <Link to="/simulations">Simulations</Link>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  );
}
