import { SimulationStatistic } from "../../../models/SimulationStatistic.model";
import { LoadingSpinner } from "../../shared/loadingSpinner";
import { ConsoleHeader } from "../../shared/simulation/consoleHeader";

export function Scheduler({
  statistics,
  isLoading,
}: {
  statistics: SimulationStatistic[];
  isLoading: boolean;
}) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="col-start-8 col-end-13">
      <ConsoleHeader>Scheduler Stats</ConsoleHeader>
      <div className="grid grid-cols-3 text-center dark:text-neutral-200">
        <span className="text-purple-500">Jobs Running</span>
        <span className="text-purple-500">Jobs Queued</span>
        <span className="text-purple-500">Down Nodes</span>
        <span>
          {statistics.reduce((prev, curr) => prev + curr.jobs_running, 0)}
        </span>
        <span>
          {statistics.reduce((prev, curr) => prev + curr.jobs_pending, 0)}
        </span>
        <span>
          {statistics.reduce((prev, curr) => prev + curr.down_nodes.length, 0)}
        </span>
      </div>
    </div>
  );
}
