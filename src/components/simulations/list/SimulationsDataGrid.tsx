import { Simulation } from "../../../models/Simulation.model";
import { SimulationsDataGridHeader } from "./SimulationsDataGridHeader";
import { SimulationsDataGridRow } from "./SimulationsDataGridRow";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";

const simulations: Simulation[] = [
  {
    state: "running",
    id: "1",
    logical_end: "2024-02-28T03:06:30.646Z",
    logical_start: "2024-02-27T03:06:30.646Z",
    run_start: "2024-02-27T03:06:30.646Z",
    run_end: null,
    user: "Jake Webb",
    progress: 0.25,
    config: {
      cooling: { enabled: false },
      start: "",
      end: "",
      scheduler: {
        enabled: true,
        jobs_mode: "random",
        jobs: [],
        num_jobs: 0,
        seed: null,
        down_nodes: [],
      },
    },
  },
];

export function SimulationsDataGrid({
  columns,
  onSort,
}: {
  columns: ColumnHeader[];
  onSort: (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => void;
}) {
  return (
    <div className="flex flex-col">
      <SimulationsDataGridHeader columns={columns} onSort={onSort} />
      <div>
        {simulations.map((sim) => (
          <SimulationsDataGridRow key={sim.id} simulation={sim} />
        ))}
      </div>
    </div>
  );
}
