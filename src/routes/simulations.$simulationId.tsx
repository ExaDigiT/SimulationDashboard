import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  Link,
  LinkProps,
  Outlet,
  createFileRoute,
} from "@tanstack/react-router";

export const Route = createFileRoute("/simulations/$simulationId")({
  component: Simulation,
});

function TabLink(props: LinkProps) {
  return (
    <Link
      className="flex flex-1 items-center justify-center border-b-2 px-4 py-4 transition-all duration-500 hover:border-b-blue-300 hover:opacity-80 dark:text-neutral-200"
      activeProps={{
        className: "border-blue-500 font-medium hover:border-b-blue-500",
      }}
      inactiveProps={{
        className: "border-neutral-400",
      }}
      {...props}
    >
      {props.children}
    </Link>
  );
}

function Simulation() {
  const { simulationId } = Route.useParams();
  const search = Route.useSearch();

  return (
    <div className="m-6 flex flex-1 flex-col justify-center overflow-hidden">
      <div className="flex items-center gap-12 dark:text-neutral-200">
        <Link
          to="/simulations/"
          className="flex items-center gap-2 self-start transition-opacity duration-500 hover:opacity-75"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to List</span>
        </Link>
        <span className="text-medium">Simulation ID: {simulationId}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col overflow-y-hidden rounded-md bg-neutral-200 shadow-xl dark:bg-neutral-800">
        <div className="flex items-center">
          <TabLink
            to="/simulations/$simulationId/summary"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Summary
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/configuration"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Configuration
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/jobs"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Jobs
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/cooling"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Power
          </TabLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
