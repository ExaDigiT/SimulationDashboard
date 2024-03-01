import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/simulations/$simulationId/cooling")({
  component: SimulationCooling,
});

function SimulationCooling() {
  return <div>cooling</div>;
}
