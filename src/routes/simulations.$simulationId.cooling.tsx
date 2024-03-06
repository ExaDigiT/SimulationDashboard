import { createFileRoute } from "@tanstack/react-router";
import { simulationCoolingCDUQueryOptions } from "../util/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/simulations/$simulationId/cooling")({
  component: SimulationCooling,
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      simulationCoolingCDUQueryOptions(opts.params.simulationId)
    ),
});

function SimulationCooling() {
  const { simulationId } = Route.useParams();
  const { data } = useSuspenseQuery(
    simulationCoolingCDUQueryOptions(simulationId)
  );

  return <div>cooling</div>;
}
