import { CSSProperties, ReactNode } from "react";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";
import { GridSizes, getGridSize } from "../../../util/gridSizing";
import { ArrowLongDownIcon } from "@heroicons/react/24/outline";

function JobListHeaderCell({
  size,
  children,
  lastIndex,
  onSort,
  column,
}: {
  size: GridSizes;
  children: ReactNode;
  lastIndex: boolean;
  onSort: (header: string, sorted: boolean, direction: "asc" | "desc") => void;
  column: ColumnHeader;
}) {
  return (
    <button
      className={`${getGridSize(size)} h-full border-neutral-400 dark:border-neutral-900 dark:text-neutral-200 ${lastIndex ? "border-r-0" : "border-r-2"} relative flex items-center justify-center`}
      onClick={(e) => {
        e.preventDefault();
        if (column.sort.sortable) {
          const direction = column.sort.sorted
            ? column.sort.direction === "asc"
              ? "desc"
              : "asc"
            : "asc";
          onSort(column.name, column.sort.direction !== "desc", direction);
        }
      }}
    >
      {children}
      {column.sort.sortable && (
        <ArrowLongDownIcon
          className={`absolute right-2 h-4 w-4 bg-neutral-300 dark:bg-neutral-800 ${column.sort?.sorted && column.sort?.direction === "asc" && "rotate-180"} transition-opacity duration-300 ease-in-out group-hover:opacity-100 ${!column.sort?.sorted && "opacity-0"}`}
        />
      )}
    </button>
  );
}

interface JobListHeaderProps {
  headers: ColumnHeader[];
  style: CSSProperties;
  onSort: (header: string, sorted: boolean, direction: "asc" | "desc") => void;
}

export function JobListHeader({ headers, style, onSort }: JobListHeaderProps) {
  return (
    <div
      className="sticky left-0 top-0 z-10 grid w-full grid-cols-12 items-center border-y-2 border-neutral-400 bg-neutral-300 dark:border-neutral-900 dark:bg-neutral-700"
      style={style}
    >
      {headers.map((header, index) => (
        <JobListHeaderCell
          key={header.propertyName}
          size={header.size ?? "small"}
          lastIndex={index === headers.length - 1}
          onSort={onSort}
          column={header}
        >
          {header.name}
        </JobListHeaderCell>
      ))}
    </div>
  );
}
