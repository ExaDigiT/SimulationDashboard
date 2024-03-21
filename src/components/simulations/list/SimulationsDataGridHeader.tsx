import { ArrowLongDownIcon } from "@heroicons/react/16/solid";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";

function SimulationsDataGridHeaderCell({
  column,
  onSort,
  index,
}: {
  column: ColumnHeader;
  onSort: (
    columnString: string,
    sorted: boolean,
    direction: "asc" | "desc"
  ) => void;
  index: number;
}) {
  return (
    <button
      className={`place-self-center flex items-center gap-3 py-3 group w-full justify-center ${index !== 0 && "border-l-2"} text-neutral-200 relative border-neutral-700`}
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
        className={`absolute right-2 bg-neutral-800 h-4 w-4 ${column.sort.sorted && column.sort.direction === "asc" && "rotate-180"} transition-opacity duration-300 ease-in-out group-hover:opacity-100 ${!column.sort.sorted && "opacity-0"}`}
      />
    </button>
  );
}

export function SimulationsDataGridHeader({
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
    <div className="grid grid-cols-7 border-b-2 bg-neutral-800 border-neutral-700">
      {columns.map((column, index) => (
        <SimulationsDataGridHeaderCell
          key={column.name}
          column={column}
          onSort={onSort}
          index={index}
        />
      ))}
    </div>
  );
}
