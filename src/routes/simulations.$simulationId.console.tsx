import { createFileRoute } from "@tanstack/react-router";
import { PressureFlowRate } from "../components/simulations/console/pressureFlowRate";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { uniqBy } from "lodash";
import { JobQueue } from "../components/simulations/console/jobQueue";
import { CDUList } from "../components/simulations/console/cduList";
import { Power } from "../components/simulations/console/power";
import { Scheduler } from "../components/simulations/console/scheduler";
import { isAfter, isBefore, isEqual, isSameSecond } from "date-fns";
import {
  useReplayCooling,
  useReplayJobs,
  useReplayScheduler,
} from "../util/hooks/useReplay";

export const Route = createFileRoute("/simulations/$simulationId/console")({
  component: SimulationConsoleView,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      start: (search.start as string) || new Date().toISOString(),
      end: (search.end as string) || new Date().toISOString(),
      currentTimestamp: search.currentTimestamp as string,
      playbackInterval: (search.playbackInterval as number) || 15,
      initialTimestamp: search.initialTimestamp as string,
    };
  },
});

function SimulationConsoleView() {
  const { simulationId } = Route.useParams();
  const { currentTimestamp, playbackInterval, initialTimestamp, start, end } =
    Route.useSearch();

  const { data: metrics, isLoading: isLoadingMetrics } = useReplayCooling({
    currentTimestamp,
    playbackInterval,
    start,
    end,
    initialTimestamp,
    simulationId,
  });

  const { data: schedulerStatistics, isLoading: isLoadingScheduler } =
    useReplayScheduler({
      simulationId,
      currentTimestamp,
      playbackInterval,
      initialTimestamp,
      end,
      start,
    });

  const { data: jobs } = useReplayJobs({
    end,
    initialTimestamp,
    playbackInterval,
    simulationId,
    start,
  });

  if (
    !currentTimestamp ||
    !metrics ||
    isLoadingMetrics ||
    !schedulerStatistics
  ) {
    return <LoadingSpinner />;
  }

  let currentMetrics = metrics.data[currentTimestamp];
  if (!currentMetrics) {
    currentMetrics = Object.values(metrics.data)[0];
  }

  const currentStatistics = schedulerStatistics.filter((stat) =>
    isSameSecond(stat.timestamp, currentTimestamp),
  );

  const distinctJobs = uniqBy(jobs, "job_id");

  return (
    <section className="grid min-w-[1024px] grid-cols-12 gap-2 overflow-auto p-2">
      <PressureFlowRate metrics={currentMetrics} />
      <JobQueue
        jobs={
          distinctJobs.filter((job) => {
            if (job.time_start) {
              return (
                (isEqual(currentTimestamp, job.time_start) ||
                  isAfter(currentTimestamp, job.time_start)) &&
                (!job.time_end ||
                  isBefore(currentTimestamp, job.time_end) ||
                  isEqual(currentTimestamp, job.time_end))
              );
            } else {
              return false;
            }
          }) ?? []
        }
      />
      <CDUList metrics={currentMetrics} />
      <Power metrics={currentMetrics} />
      <Scheduler
        statistics={currentStatistics}
        isLoading={isLoadingScheduler}
      />
    </section>
  );
}
