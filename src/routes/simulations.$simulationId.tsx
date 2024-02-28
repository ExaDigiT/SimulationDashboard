import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/simulations/$simulationId")({
  component: Simulation,
});

function Simulation() {
  const { simulationId } = Route.useParams();

  return <div>This is {simulationId}</div>;
}
