import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Modal } from "../components/shared/modal";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ListResponse } from "../util/queryOptions";
import { Job } from "../models/Job.model";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { useState } from "react";
import Box from "../components/shared/simulation/box";
import { convertDateTimeString } from "../util/datetime";

export const Route = createFileRoute("/simulations/$simulationId/jobs/$jobId")({
  component: JobModal,
});

function JobModal() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { jobId, simulationId } = Route.useParams();
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["simulation", "jobs", simulationId, "job", jobId],
    queryFn: async () => {
      const res = await axios.get<ListResponse<Job>>(
        `/frontier/simulation/${simulationId}/scheduler/jobs?job_id=eq:${jobId}`,
      );

      return res.data;
    },
    select: (data) => {
      if (data.results.length > 0) {
        return data.results[0];
      }
    },
  });

  return (
    <Modal open={!!jobId}>
      <header className="flex items-center justify-between border-b-2 px-4 py-2">
        <span className="text-lg font-medium">Job Details</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate({
              to: "/simulations/$simulationId/jobs",
              params: { simulationId: simulationId },
              search: (prev) => ({ ...prev }),
            });
          }}
          className="transition-opacity duration-500 hover:opacity-50"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </header>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : isError || !data ? (
        <div className="flex flex-1 flex-col items-center justify-center">
          <ExclamationTriangleIcon className="h-8 w-8" />
          <h1>Error Loading Job with ID: {jobId}</h1>
        </div>
      ) : (
        <section className="flex flex-wrap gap-8 overflow-auto p-4">
          <Box>
            <Box.Header>Job Id</Box.Header>
            <Box.Value>{data.job_id}</Box.Value>
          </Box>
          <Box>
            <Box.Header>State</Box.Header>
            <Box.Value>{data.state_current}</Box.Value>
          </Box>
          <Box>
            <Box.Header>Time Submitted</Box.Header>
            <Box.Value>{convertDateTimeString(data.time_submission)}</Box.Value>
          </Box>
          <Box>
            <Box.Header>Time Range</Box.Header>
            <Box.Value>
              {convertDateTimeString(data.time_start)} -{" "}
              {data.time_end
                ? convertDateTimeString(data.time_end)
                : "Unfinished"}
            </Box.Value>
          </Box>
          <Box>
            <Box.Header>Node Count</Box.Header>
            <Box.Value>{data.node_count}</Box.Value>
          </Box>
          <Box>
            <Box.Header>Node Range</Box.Header>
            <Box.Value>{data.node_ranges}</Box.Value>
          </Box>
          <Box>
            <Box.Header>X-Names</Box.Header>
            <input
              placeholder="Search..."
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value);
              }}
              value={search}
              className="rounded-md border-2 bg-transparent px-3 py-1 text-black focus:outline-none dark:text-neutral-200"
            />
            <div className="mt-2 flex max-h-64 w-full flex-col overflow-auto px-8">
              {data.xnames
                .filter((xname) => (search ? xname.includes(search) : true))
                .map((xname) => (
                  <span id={xname}>{xname}</span>
                ))}
            </div>
          </Box>
        </section>
      )}
    </Modal>
  );
}
