import { ArrowLongDownIcon } from "@heroicons/react/16/solid";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";
import { CSSProperties } from "react";

function SimulationsDataGridHeaderCell({
  column,
  onSort,
  index,
}: {
  column: ColumnHeader;
  onSort: (
    columnString: string,
    sorted: boolean,
    direction: "asc" | "desc",
  ) => void;
  index: number;
}) {
  return (
    <button
      className={`group flex w-full items-center justify-center gap-3 place-self-center py-3 ${index !== 0 && "border-l-2"} relative border-neutral-400 dark:border-neutral-700 dark:text-neutral-200`}
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
        className={`absolute right-2 h-4 w-4 bg-neutral-300 dark:bg-neutral-800 ${column.sort.sorted && column.sort.direction === "asc" && "rotate-180"} transition-opacity duration-300 ease-in-out group-hover:opacity-100 ${!column.sort.sorted && "opacity-0"}`}
      />
    </button>
  );
}

export function SimulationsDataGridHeader({
  columns,
  onSort,
  style,
}: {
  columns: ColumnHeader[];
  onSort: (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc",
  ) => void;
  style: CSSProperties;
}) {
  return (
    <div
      className="grid grid-cols-7 border-b-2 border-neutral-400 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
      style={{ ...style }}
    >
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
