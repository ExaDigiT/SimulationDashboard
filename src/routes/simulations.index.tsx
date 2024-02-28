import { createFileRoute } from "@tanstack/react-router";
import { SimulationListControls } from "../components/simulations/list/SimulationListControls";
import { SimulationsDataGrid } from "../components/simulations/list/SimulationsDataGrid";

export const Route = createFileRoute("/simulations/")({
  component: SimulationList,
});

function SimulationList() {
  return (
    <div className="flex-1 flex flex-col">
      <SimulationListControls />
      <SimulationsDataGrid />
    </div>
  );
}
