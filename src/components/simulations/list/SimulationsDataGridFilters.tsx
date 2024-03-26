import {
  AdjustmentsHorizontalIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Modal } from "../../shared/modal";
import { Button } from "../../shared/button";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";
import { FilterOperators } from "../../../models/filters/filterOperators.enum";
import { SimulationDataGridFilterInput } from "./SimulationsDataGridFilterInput";
import { Select } from "../../shared/dropdown";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "@tanstack/react-router";
import {
  operatorCombinator,
  sortCombinator,
} from "../../../util/filterCombinator";

export function SimulationsDataGridFilter({
  columns,
  setColumns,
}: {
  columns: ColumnHeader[];
  setColumns: (columns: ColumnHeader[]) => void;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openColumn, setOpenColumn] = useState(0);
  const [updatedColumns, setUpdatedColumns] = useState(
    structuredClone(columns)
  );

  const currentColumn = updatedColumns[openColumn];
  const isActiveFilters = columns.some((column) =>
    column.activeFilters.some((filter) => filter.value)
  );

  const onClose = (reset?: boolean) => {
    setIsOpen(false);
    setOpenColumn(0);
    if (reset) {
      setUpdatedColumns(columns);
    }
  };

  const onApplyFilters = () => {
    setColumns(
      updatedColumns.map((column) => ({
        ...column,
        activeFilters: column.activeFilters.filter((filter) => !!filter),
      }))
    );
    navigate({
      search: () => {
        const sortParams = updatedColumns
          .filter((column) => column.sort.sorted)
          .reduce<{ [key: string]: string }>((prev, curr) => {
            const param = sortCombinator([curr]).split("=");
            return { ...prev, [param[0]]: param[1] };
          }, {});

        const filterParams = updatedColumns
          .filter((column) => column.activeFilters.length > 0)
          .reduce<{ [key: string]: string }>((prev, curr) => {
            const param = operatorCombinator([curr]).split("=");
            return { ...prev, [param[0]]: param[1] };
          }, {});
        return { ...sortParams, ...filterParams };
      },
      params: {},
    });
    onClose();
  };

  return (
    <>
      <button
        className={`flex items-center justify-center flex-1 w-full gap-2 hover:opacity-75 duration-500 transition-all border-l-2 border-b-2 border-neutral-400 dark:border-neutral-700 dark:text-neutral-200 ${isActiveFilters && "bg-blue-500 text-white border-blue-500 hover:bg-blue-500 hover:opacity-75"}`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <AdjustmentsHorizontalIcon className="w-4 h-4" />
        <span>Filters</span>
      </button>
      <Modal open={isOpen}>
        <header className="flex items-center justify-between px-4 py-2 border-b-2">
          <span className="text-lg font-medium">Simulation Filter Options</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose(true);
            }}
            className="transition-opacity duration-500 hover:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        <section className="flex-1 flex overflow-auto">
          <div className="flex flex-col border-r-2 w-1/4">
            {columns.map((column, index) => (
              <button
                key={column.propertyName}
                className={`font-medium px-4 py-2 border-b-2 hover:opacity-50 duration-500 transition-opacity items-start flex ${index === openColumn && "bg-blue-500 text-white hover:opacity-100"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenColumn(index);
                }}
              >
                {column.name}
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col px-8 py-4 gap-4 overflow-auto">
            {currentColumn?.activeFilters.map((filter, index) => (
              <div
                key={`${openColumn}-filter-${index}`}
                className="flex gap-4 items-center"
              >
                <Select
                  choices={currentColumn.operators.map((operator) => ({
                    label:
                      Object.keys(FilterOperators)[
                        Object.values(FilterOperators).indexOf(operator)
                      ],
                    value: operator,
                  }))}
                  value={filter.operator}
                  onChange={(e) => {
                    const newColumsns = [...updatedColumns];
                    const column = newColumsns[openColumn];
                    const value = e.target.value as FilterOperators;
                    if (Object.values(FilterOperators).includes(value)) {
                      column.activeFilters[index].operator = value;
                    }
                    setUpdatedColumns(newColumsns);
                  }}
                />
                <div className="flex-1">
                  <SimulationDataGridFilterInput
                    fieldType={currentColumn.inputType}
                    value={filter.value}
                    onChange={(value: string | null) => {
                      const newColumns = [...updatedColumns];
                      const column = newColumns[openColumn];
                      if (value) {
                        column.activeFilters[index].value = value;
                      }
                      setUpdatedColumns(newColumns);
                    }}
                    choices={
                      currentColumn.inputType === "select"
                        ? currentColumn.selectOptions
                        : []
                    }
                  />
                </div>
                <button
                  className="ml-auto hover:opacity-75 transition-opacity duration-500"
                  onClick={(e) => {
                    e.preventDefault();
                    const newColumns = [...updatedColumns];
                    const column = newColumns[openColumn];
                    column.activeFilters.splice(index, 1);
                    setUpdatedColumns(newColumns);
                  }}
                  data-tooltip-id="delete-filter-tooltip"
                  data-tooltip-content={"Delete Filter"}
                  data-tooltip-delay-show={500}
                >
                  <TrashIcon className="w-5 h-5 text-red-600" />
                </button>
                <Tooltip id="delete-filter-tooltip" />
              </div>
            ))}
            <button
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                const newColumns = [...updatedColumns];
                const column = newColumns[openColumn];
                if (column) {
                  column.activeFilters.push({
                    operator: FilterOperators.Contains,
                    value: "",
                  });
                }
                setUpdatedColumns(newColumns);
              }}
            >
              <PlusIcon className="w-4 h-4 text-green-500" />
              <span>Add New Filter</span>
            </button>
          </div>
        </section>
        <footer className="border-t-2 flex items-center justify-end py-2 px-4 gap-4">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClose(true);
            }}
            variant="outlined"
            dense
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onApplyFilters();
            }}
            variant="filled"
            dense
          >
            Apply Filters
          </Button>
        </footer>
      </Modal>
    </>
  );
}
