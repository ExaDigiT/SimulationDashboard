import { ArrowLongDownIcon } from "@heroicons/react/16/solid";
import { SimulationColumn } from "./SimulationsGridColumns";

function SimulationsDataGridHeaderCell({
  column,
  onSort,
}: {
  column: SimulationColumn;
  onSort: (
    columnString: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => void;
}) {
  return (
    <button
      className="place-self-center flex items-center gap-3 py-3 group w-full justify-center"
      onClick={(e) => {
        e.preventDefault();
        const direction = column.sort.sorted
          ? column.sort.direction === "asc"
            ? "desc"
            : "asc"
          : "asc";
        onSort(column.name, column.sort.direction !== "desc", direction);
      }}
    >
      <span>{column.name}</span>
      <ArrowLongDownIcon
        className={`h-4 w-4 ${column.sort.sorted && column.sort.direction === "asc" && "rotate-180"} transition-opacity duration-300 ease-in-out group-hover:opacity-100 ${!column.sort.sorted && "opacity-0"}`}
      />
    </button>
  );
}

export function SimulationsDataGridHeader({
  columns,
  onSort,
}: {
  columns: SimulationColumn[];
  onSort: (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => void;
}) {
  return (
    <div className="grid grid-cols-7 border-b-2">
      {columns.map((column) => (
        <SimulationsDataGridHeaderCell
          key={column.name}
          column={column}
          onSort={onSort}
        />
      ))}
    </div>
  );
}
