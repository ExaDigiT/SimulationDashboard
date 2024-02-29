import { Link } from "@tanstack/react-router";
import { SimulationsDataGridFilter } from "./SimulationsDataGridFilters";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";

export function SimulationListControls({
  columns,
  setColumns,
}: {
  columns: ColumnHeader[];
  setColumns: (columns: ColumnHeader[]) => void;
}) {
  return (
    <div className="h-16 flex">
      <div className="flex-1 border-b-2">Place Holder for Timeline Graph</div>
      <div className="flex flex-col">
        <span className="border-b-2 px-3 py-1 border-l-2">1 Simulation(s)</span>
        <SimulationsDataGridFilter columns={columns} setColumns={setColumns} />
      </div>
      <Link
        to="/simulations/new"
        className="bg-green-600 text-white px-3 text-center flex items-center transition-opacity duration-500 hover:opacity-80"
      >
        New Simulation
      </Link>
    </div>
  );
}
