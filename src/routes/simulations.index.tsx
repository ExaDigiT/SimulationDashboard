import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimulationListControls } from "../components/simulations/list/SimulationListControls";
import { SimulationsDataGrid } from "../components/simulations/list/SimulationsDataGrid";
import { columns as SimulationColumns } from "../components/simulations/list/SimulationsGridColumns";

export const Route = createFileRoute("/simulations/")({
  component: SimulationList,
});

function SimulationList() {
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
    <div className="flex-1 flex flex-col">
      <SimulationListControls columns={columns} setColumns={setColumns} />
      <SimulationsDataGrid columns={columns} onSort={onSort} />
    </div>
  );
}
