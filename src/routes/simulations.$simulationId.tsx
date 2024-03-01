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
      className="px-4 py-4 border-b-2 flex-1 flex justify-center items-center hover:border-b-blue-300 transition-all duration-500 hover:opacity-80"
      activeProps={{
        className: "border-blue-500 font-medium hover:border-b-blue-500",
      }}
      {...props}
    >
      {props.children}
    </Link>
  );
}

function Simulation() {
  const { simulationId } = Route.useParams();

  return (
    <div className="flex justify-center flex-col m-6 flex-1">
      <div className="flex items-center gap-12">
        <Link
          to="/simulations/"
          className="flex gap-2 items-center self-start hover:opacity-75 transition-opacity duration-500"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to List</span>
        </Link>
        <span>Simulation ID: {simulationId}</span>
      </div>
      <div className="flex-1 rounded-md shadow-xl mt-4 flex flex-col overflow-y-hidden">
        <div className="flex items-center">
          <TabLink
            to="/simulations/$simulationId/configuration"
            params={{ simulationId: simulationId }}
          >
            Configuration
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/jobs"
            params={{ simulationId: simulationId }}
          >
            Jobs
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/cooling"
            params={{ simulationId: simulationId }}
          >
            Cooling CDU
          </TabLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
