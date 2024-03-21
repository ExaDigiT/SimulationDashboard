import { Link } from "@tanstack/react-router";
import { Simulation } from "../../../models/Simulation.model";
import { convertDateTimeString } from "../../../util/datetime";

function SimulationDataGridCell({
  value,
  index,
}: {
  value: string;
  index?: number;
}) {
  return (
    <div
      className={`flex w-full items-center justify-center ${index !== 0 && "border-l-2"} py-3 flex-nowrap px-2 text-neutral-200 border-neutral-700`}
    >
      <span className="overflow-hidden text-nowrap text-ellipsis" title={value}>
        {value}
      </span>
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
      to="/simulations/$simulationId/configuration"
      params={{ simulationId: simulation.id }}
      className="grid grid-cols-7 border-b-2 hover:opacity-75 duration-500 transition-opacity border-neutral-700"
      search={{
        start: simulation.start,
        end: simulation.end,
        timestepType: "resolution",
        resolution: 10,
      }}
    >
      <SimulationDataGridCell value={simulation.id} index={0} />
      <div className="flex w-full items-center justify-center border-l-2 py-3 flex-nowrap px-2 border-neutral-700">
        <div
          className={`px-2 rounded-full self-center min-w-0 text-white ${simulation.state === "success" ? "bg-green-600" : simulation.state === "fail" ? "bg-red-600" : "bg-blue-500"}`}
        >
          {simulation.state.charAt(0).toUpperCase() + simulation.state.slice(1)}
        </div>
      </div>
      <SimulationDataGridCell value={simulation.user} />
      <SimulationDataGridCell value={convertDateTimeString(simulation.start)} />
      <SimulationDataGridCell value={convertDateTimeString(simulation.end)} />
      <SimulationDataGridCell
        value={convertDateTimeString(simulation.execution_start)}
      />
      <SimulationDataGridCell
        value={convertDateTimeString(simulation.execution_end)}
      />
    </Link>
  );
}
