import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/simulations/$simulationId/jobs")({
  component: SimulationJobs,
});

function SimulationJobs() {
  return <div>jobs</div>;
}
