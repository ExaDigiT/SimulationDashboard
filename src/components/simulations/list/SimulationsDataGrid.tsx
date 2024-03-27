import { Simulation } from "../../../models/Simulation.model";
import { SimulationsDataGridHeader } from "./SimulationsDataGridHeader";
import { SimulationsDataGridRow } from "./SimulationsDataGridRow";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";
import { LoadingSpinner } from "../../shared/loadingSpinner";

export function SimulationsDataGrid({
  columns,
  onSort,
  rows,
  isLoading,
}: {
  columns: ColumnHeader[];
  onSort: (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => void;
  rows: Simulation[];
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col">
      <SimulationsDataGridHeader columns={columns} onSort={onSort} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {rows.map((sim) => (
            <SimulationsDataGridRow key={sim.id} simulation={sim} />
          ))}
        </div>
      )}
    </div>
  );
}
