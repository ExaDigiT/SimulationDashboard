import { Link } from "@tanstack/react-router";
import { Simulation } from "../../../models/Simulation.model";
import { convertDateTimeString } from "../../../util/datetime";

function SimulationDataGridCell({
  value,
  center,
}: {
  value: string;
  center?: boolean;
}) {
  return (
    <div
      className={`flex w-full items-center ${center && "justify-center"} justify-center`}
    >
      <span className="overflow-hidden text-nowrap text-ellipsis">{value}</span>
    </div>
  );
}

export function SimulationsDataGridRow({
  simulation,
}: {
  simulation: Simulation;
}) {
  return (
    <Link
      to="/simulations/$simulationId"
      params={{ simulationId: simulation.id }}
      className="grid grid-cols-7 py-3 border-b-2 hover:bg-neutral-100 duration-500 transition-colors"
    >
      <SimulationDataGridCell value={simulation.id} center />
      <SimulationDataGridCell
        value={
          simulation.state.charAt(0).toUpperCase() + simulation.state.slice(1)
        }
      />
      <SimulationDataGridCell value={simulation.user} />
      <SimulationDataGridCell
        value={convertDateTimeString(simulation.logical_start)}
      />
      <SimulationDataGridCell
        value={convertDateTimeString(simulation.logical_end)}
      />
      <SimulationDataGridCell
        value={convertDateTimeString(simulation.run_start)}
      />
      <SimulationDataGridCell
        value={
          simulation.run_end ? convertDateTimeString(simulation.run_end) : "-"
        }
      />
    </Link>
  );
}
