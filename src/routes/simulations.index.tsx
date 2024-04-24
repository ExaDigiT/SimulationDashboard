import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimulationListControls } from "../components/simulations/list/SimulationListControls";
import { SimulationsDataGrid } from "../components/simulations/list/SimulationsDataGrid";
import { columns as SimulationColumns } from "../components/simulations/list/SimulationsGridColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "../util/apis";
import { Simulation } from "../models/Simulation.model";
import { operatorCombinator, sortCombinator } from "../util/filterCombinator";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/simulations/")({
  component: SimulationList,
});

const pageLimit = 50;

function SimulationList() {
  const [columns, setColumns] = useState(structuredClone(SimulationColumns));
  const [currentPage] = useState(0);

  const { data, isLoading, isError } = useQuery<{
    limit: number;
    offset: number;
    total_results: number;
    results: Simulation[];
  }>({
    queryKey: ["simulation", "list", currentPage, columns],
    queryFn: async () => {
      const sortParams = sortCombinator(columns);
      const filterParams = operatorCombinator(columns);
      const params =
        (sortParams ? "&" : "") +
        sortParams +
        (filterParams ? "&" : "") +
        filterParams;
      const res = await axios.get(
        `/frontier/simulation/list?limit=${pageLimit}&offset=${currentPage * pageLimit}${params}`,
      );

      return res.data;
    },
  });

  const onSort = (
    columnName: string,
    sorted: boolean,
    direction: "asc" | "desc",
  ) => {
    const updatedColumns = [...columns];
    const currentColumn = updatedColumns.find(
      (column) => column.name === columnName,
    );

    if (currentColumn) {
      currentColumn.sort.sorted = sorted;
      currentColumn.sort.direction = direction;
    }

    setColumns(updatedColumns);
  };

  if (isError) {
    return (
      <div>
        <ExclamationTriangleIcon className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <SimulationListControls
        columns={columns}
        setColumns={setColumns}
        totalRows={data?.total_results ?? 0}
      />
      <SimulationsDataGrid
        isLoading={isLoading}
        columns={columns}
        onSort={onSort}
        rows={data?.results ?? []}
      />
    </div>
  );
}
