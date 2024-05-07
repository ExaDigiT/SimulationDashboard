import { createFileRoute } from "@tanstack/react-router";
import { ListResponse } from "../util/queryOptions";
import { useInfiniteQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { JobList } from "../components/jobs/JobList";
import { headers as JobColumns } from "../components/jobs/list/JobListColumns";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { operatorCombinator, sortCombinator } from "../util/filterCombinator";
import { Job } from "../models/Job.model";
import axios from "axios";
import { useState } from "react";
import { ColumnHeader } from "../models/dataGrid/columnHeader.model";
import { Tooltip } from "react-tooltip";
import { JobListFilterModal } from "../components/jobs/list/JobListFilterModal";

export const Route = createFileRoute("/simulations/$simulationId/jobs")({
  component: SimulationJobs,
});

const jobLimit = 15;

function SimulationJobs() {
  const { simulationId } = Route.useParams();
  const [columns, setColumns] = useState(structuredClone(JobColumns));
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["simulation", "jobs", simulationId, columns],
      queryFn: async ({ pageParam }) => {
        const sortParams = sortCombinator(columns);
        const filterParams = operatorCombinator(columns);
        const params =
          (sortParams ? "&" : "") +
          sortParams +
          (filterParams ? "&" : "") +
          filterParams;
        const res = await axios.get<ListResponse<Job>>(
          `/frontier/simulation/${simulationId}/scheduler/jobs?limit=${jobLimit}&offset=${pageParam * jobLimit}${params}`,
        );

        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        allPages.length <= lastPage.total_results / jobLimit
          ? allPages.length
          : undefined,
      refetchOnWindowFocus: false,
    });

  const onSort = (header: ColumnHeader) => {
    const newHeaders = [...columns];
    const updatedHeader = newHeaders.find(
      (h) => h.propertyName === header.propertyName,
    );
    if (updatedHeader) {
      updatedHeader.sort.sorted =
        !updatedHeader.sort.sorted || updatedHeader.sort.direction === "asc";
      updatedHeader.sort.direction =
        updatedHeader.sort.direction === "desc"
          ? null
          : !updatedHeader.sort.direction
            ? "asc"
            : "desc";
    }
    setColumns(newHeaders);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const jobs = data?.pages.map((page) => page.results).flat() ?? [];
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center justify-end gap-4 px-4 py-4">
        <button
          className="rounded-full px-2 py-2 transition-colors duration-500 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-neutral-700"
          data-tooltip-id="download-tooltip"
          data-tooltip-content={"Export to CSV"}
          data-tooltip-delay-show={500}
        >
          <ArrowDownTrayIcon className="h-6 w-6" />
        </button>
        <JobListFilterModal columns={columns} setColumns={setColumns} />
        <Tooltip id="download-tooltip" />
      </div>
      <JobList
        jobs={jobs}
        totalJobs={data?.pages[0].total_results ?? 0}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onSort={onSort}
      />
    </div>
  );
}
