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
      className="px-4 py-4 border-b-2 flex-1 flex justify-center items-center hover:border-b-blue-300 transition-all duration-500 hover:opacity-80 dark:text-neutral-200"
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
    <div className="flex justify-center flex-col m-6 flex-1 overflow-hidden">
      <div className="flex items-center gap-12 dark:text-neutral-200">
        <Link
          to="/simulations/"
          className="flex gap-2 items-center self-start hover:opacity-75 transition-opacity duration-500"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to List</span>
        </Link>
        <span className="text-medium">Simulation ID: {simulationId}</span>
      </div>
      <div className="flex-1 rounded-md shadow-xl mt-4 flex flex-col overflow-y-hidden bg-neutral-200 dark:bg-neutral-800">
        <div className="flex items-center">
          <TabLink
            to="/simulations/$simulationId/configuration"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Configuration
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/summary"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Summary
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
