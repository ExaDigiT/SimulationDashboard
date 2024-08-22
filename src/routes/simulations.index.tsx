import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SimulationListControls } from "../components/simulations/list/SimulationListControls";
import { SimulationsDataGrid } from "../components/simulations/list/SimulationsDataGrid";
import { columns as SimulationColumns } from "../components/simulations/list/SimulationsGridColumns";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Simulation } from "../models/Simulation.model";
import { operatorCombinator, sortCombinator } from "../util/filterCombinator";
import { ListResponse } from "../util/queryOptions";

export const Route = createFileRoute("/simulations/")({
  component: SimulationList,
});

const pageLimit = 18;

function SimulationList() {
  const [columns, setColumns] = useState(structuredClone(SimulationColumns));

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["simulation", "list", columns],
    queryFn: async ({ pageParam }) => {
      const sortParams = sortCombinator(columns);
      const filterParams = operatorCombinator(columns);
      const fields = `&fields=all`;
      const params =
        fields +
        (sortParams ? "&" : "") +
        sortParams +
        (filterParams ? "&" : "") +
        filterParams;
      const res = await axios.get<ListResponse<Simulation>>(
        `/frontier/simulation/list?limit=${pageLimit}&offset=${pageParam * pageLimit}${params}`,
      );

      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length <= lastPage.total_results / pageLimit
        ? allPages.length
        : undefined,
    refetchOnWindowFocus: false,
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

  const simulations = data?.pages.map((page) => page.results).flat() ?? [];
  return (
    <div className="flex flex-1 flex-col">
      <SimulationListControls
        columns={columns}
        setColumns={setColumns}
        totalRows={data?.pages[0].total_results ?? 0}
      />
      <SimulationsDataGrid
        isLoading={isLoading}
        isError={isError}
        columns={columns}
        onSort={onSort}
        rows={simulations}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        total_results={data?.pages[0].total_results ?? 0}
      />
    </div>
  );
}
