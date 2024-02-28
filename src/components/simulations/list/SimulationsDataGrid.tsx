import { useState } from "react";
import { Simulation } from "../../../models/Simulation.model";
import { SimulationsDataGridHeader } from "./SimulationsDataGridHeader";
import { columns as SimulationColumns } from "./SimulationsGridColumns";
import { SimulationsDataGridRow } from "./SimulationsDataGridRow";

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

export function SimulationsDataGrid() {
  const [columns, setColumns] = useState(SimulationColumns);

  const onSort = (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => {
    const updatedColumns = [...columns];
    const currentColumn = updatedColumns.find(
      (column) => column.name === columnName
    );

    if (currentColumn) {
      currentColumn.sort.sorted = sorted;
      currentColumn.sort.direction = direction;
    }

    setColumns(updatedColumns);
  };

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
