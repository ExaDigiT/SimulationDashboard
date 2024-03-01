import { Simulation } from "../../../models/Simulation.model";
import { SimulationsDataGridHeader } from "./SimulationsDataGridHeader";
import { SimulationsDataGridRow } from "./SimulationsDataGridRow";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";

export function SimulationsDataGrid({
  columns,
  onSort,
  rows,
}: {
  columns: ColumnHeader[];
  onSort: (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => void;
  rows: Simulation[];
}) {
  return (
    <div className="flex flex-col">
      <SimulationsDataGridHeader columns={columns} onSort={onSort} />
      <div>
        {rows.map((sim) => (
          <SimulationsDataGridRow key={sim.id} simulation={sim} />
        ))}
      </div>
    </div>
  );
}
