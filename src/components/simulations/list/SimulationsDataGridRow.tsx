import { Link } from "@tanstack/react-router";
import { Simulation } from "../../../models/Simulation.model";
import { convertDateTimeString } from "../../../util/datetime";
import { CSSProperties } from "react";

function SimulationDataGridCell({
  value,
  index,
}: {
  value: string;
  index?: number;
}) {
  return (
    <div
      className={`flex w-full items-center justify-center ${index !== 0 && "border-l-2"} flex-nowrap border-neutral-400 px-2 py-3 dark:border-neutral-700 dark:text-neutral-200`}
    >
      <span className="overflow-hidden text-ellipsis text-nowrap" title={value}>
        {value}
      </span>
    </div>
  );
}

export function SimulationsDataGridRow({
  simulation,
  style,
}: {
  simulation: Simulation;
  style: CSSProperties;
}) {
  return (
    <Link
      to="/simulations/$simulationId/summary"
      params={{ simulationId: simulation.id }}
      className="grid w-full grid-cols-8 border-b-2 border-neutral-400 transition-opacity duration-500 hover:opacity-75 dark:border-neutral-700"
      search={{
        start: simulation.start,
        end: simulation.end,
        currentTimestamp: simulation.end,
        initialTimestamp: simulation.end,
        playbackInterval: 15,
      }}
      style={{ ...style }}
    >
      <SimulationDataGridCell value={simulation.id} index={0} />
      <div className="flex w-full flex-nowrap items-center justify-center border-l-2 border-neutral-400 px-2 py-3 dark:border-neutral-700">
        <div
          className={`min-w-0 self-center rounded-full px-2 text-white ${simulation.state === "success" ? "bg-green-600" : simulation.state === "fail" ? "bg-red-600" : "bg-blue-500"}`}
        >
          {simulation.state.charAt(0).toUpperCase() + simulation.state.slice(1)}
        </div>
      </div>
      <SimulationDataGridCell value={simulation.user} />
      <SimulationDataGridCell value={simulation.config.scheduler.jobs_mode} />
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
