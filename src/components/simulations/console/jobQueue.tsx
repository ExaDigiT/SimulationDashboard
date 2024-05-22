import { Job } from "../../../models/Job.model";
import { ConsoleHeader } from "../../shared/simulation/consoleHeader";

export function JobQueue({ jobs }: { jobs: Job[] }) {
  return (
    <div className="col-start-8 col-end-13 row-start-1 row-end-10 flex flex-col">
      <ConsoleHeader>Job Queue</ConsoleHeader>
      <div className="overflow-hidden border-2 text-center text-sm">
        <div className="grid grid-cols-4 border-b-2 text-xs text-purple-500">
          <span className="border-r-2">Job Id</span>
          <span className="border-r-2">Name</span>
          <span className="border-r-2">State</span>
          <span>Nodes</span>
        </div>
        <div className="overflow-auto">
          {jobs.map((job) => (
            <div
              className="grid grid-cols-4 dark:text-neutral-200"
              key={job.job_id}
            >
              <span className="border-r-2">{job.job_id}</span>
              <span
                className="overflow-hidden text-ellipsis whitespace-nowrap border-r-2 px-2"
                title={job.name}
              >
                {job.name}
              </span>
              <span className="border-r-2">{job.state_current.charAt(0)}</span>
              <span>{job.node_count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
