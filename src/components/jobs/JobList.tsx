import { ReactNode, useRef } from "react";
import { defaultRangeExtractor, useVirtualizer } from "@tanstack/react-virtual";
import { Job } from "../../models/Job.model";
import { convertDateTimeString } from "../../util/datetime";
import { JobListHeader } from "./list/JobListHeader";
import { ColumnHeader } from "../../models/dataGrid/columnHeader.model";
import { headers } from "./list/JobListColumns";
import { GridSizes, getGridSize } from "../../util/gridSizing";
import { FetchNextPageOptions } from "@tanstack/react-query";

function JobListColumn({
  size,
  children,
  noBorder,
}: {
  size: GridSizes;
  children: ReactNode;
  noBorder?: boolean;
}) {
  return (
    <div
      className={`flex-auto overflow-hidden text-nowrap text-ellipsis text-neutral-200 ${getGridSize(size)} flex items-center justify-center px-1 border-r-2 border-neutral-900 h-full ${noBorder && "border-r-0"}`}
      title={children?.toString()}
    >
      <span className="overflow-hidden text-ellipsis text-nowrap">
        {children}
      </span>
    </div>
  );
}

export function JobList({
  jobs,
  totalJobs,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onSort,
}: {
  jobs: Job[];
  totalJobs: number;
  fetchNextPage: (options?: FetchNextPageOptions | undefined) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onSort: (column: ColumnHeader) => void;
}) {
  const rows: (ColumnHeader[] | Job)[] = [headers, ...jobs];

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: totalJobs + 1,
    estimateSize: () => 50,
    getScrollElement: () => parentRef.current,
    rangeExtractor: (range) => {
      const newRows = new Set([0, ...defaultRangeExtractor(range)]);
      return [...newRows];
    },
  });

  return (
    <div className="flex-1 flex-col flex overflow-hidden bg-neutral-700">
      <div ref={parentRef} className="flex-1 overflow-auto flex flex-col">
        <div
          className="relative w-full"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const job = rows[virtualItem.index];

            if (virtualItem.index === 0 && Array.isArray(job)) {
              return (
                <JobListHeader
                  headers={job}
                  key={virtualItem.key}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  onSort={onSort}
                />
              );
            } else if (!Array.isArray(job)) {
              return (
                <div
                  key={virtualItem.key}
                  className={`absolute top-0 left-0 w-full grid grid-cols-12 items-center hover:opacity-50 transition-opacity duration-500 bg-neutral-700 border-b-2 border-neutral-800`}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <JobListColumn size="small">{job.job_id}</JobListColumn>
                  <JobListColumn size="small">{job.name}</JobListColumn>
                  <JobListColumn size="small">
                    {job.state_current}
                  </JobListColumn>
                  <JobListColumn size="small">{job.node_count}</JobListColumn>
                  <JobListColumn size="large">
                    {convertDateTimeString(job.time_submission)}
                  </JobListColumn>
                  <JobListColumn size="small">{job.time_limit}</JobListColumn>
                  <JobListColumn size="medium">
                    {convertDateTimeString(job.time_start)}
                  </JobListColumn>
                  <JobListColumn size="medium" noBorder>
                    {convertDateTimeString(job.time_end)}
                  </JobListColumn>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
        {hasNextPage ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchNextPage();
            }}
            disabled={isFetchingNextPage}
            className="rounded-md px-4 py-2 self-center text-neutral-200 hover:opacity-50 transition-opacity duration-500"
          >
            Load More Jobs...
          </button>
        ) : null}
      </div>
    </div>
  );
}
