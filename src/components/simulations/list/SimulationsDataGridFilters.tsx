import {
  AdjustmentsHorizontalIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BaseSyntheticEvent, useState } from "react";
import { Modal } from "../../shared/modal";
import { Button } from "../../shared/button";
import { ColumnHeader } from "../../../models/dataGrid/columnHeader.model";
import { FilterOperators } from "../../../models/filters/filterOperators.enum";
import { SimulationDataGridFilterInput } from "./SimulationsDataGridFilterInput";
import { Select } from "../../shared/dropdown";

export function SimulationsDataGridFilter({
  columns,
  setColumns,
}: {
  columns: ColumnHeader[];
  setColumns: (columns: ColumnHeader[]) => void;
}) {
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
    onClose();
  };

  return (
    <>
      <button
        className={`flex items-center justify-center flex-1 w-full gap-2 hover:bg-neutral-100 duration-500 transition-all border-l-2 border-b-2 ${isActiveFilters && "bg-blue-500 text-white border-blue-500 hover:bg-blue-500 hover:opacity-75"}`}
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
                className={`px-4 py-2 border-b-2 hover:bg-neutral-100 duration-500 transition-colors items-start flex ${index === openColumn && "bg-blue-500 text-white hover:bg-blue-500"}`}
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
                    onChange={(e: BaseSyntheticEvent) => {
                      const newColumns = [...updatedColumns];
                      const column = newColumns[openColumn];
                      column.activeFilters[index].value = e.target.value;
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
                >
                  <TrashIcon className="w-4 h-4 text-red-600" />
                </button>
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
