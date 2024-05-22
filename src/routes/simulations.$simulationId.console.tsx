import { createFileRoute } from "@tanstack/react-router";
import { PressureFlowRate } from "../components/simulations/console/pressureFlowRate";
import { InfiniteData, useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { groupBy } from "lodash";
import { CoolingCDU } from "../models/CoolingCDU.model";
import { JobQueue } from "../components/simulations/console/jobQueue";
import { CDUList } from "../components/simulations/console/cduList";
import { Power } from "../components/simulations/console/power";
import { Scheduler } from "../components/simulations/console/scheduler";
import { SimulationStatistic } from "../models/SimulationStatistic.model";
import { Job } from "../models/Job.model";
import { isAfter, isBefore } from "date-fns";

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
  const { currentTimestamp, playbackInterval, initialTimestamp } =
    Route.useSearch();

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: [
      "simulation",
      simulationId,
      "cooling",
      playbackInterval,
      initialTimestamp,
    ],
    select: (
      data: InfiniteData<{
        granularity: number;
        start: string;
        end: string;
        data: CoolingCDU[];
      }>,
    ) => {
      const allData = data.pages.map((page) => page.data).flat();
      return groupBy(allData, "timestamp");
    },
  });

  const { data: schedulerStatistics, isLoading: isLoadingScheduler } = useQuery(
    {
      queryKey: [
        "simulation",
        simulationId,
        "scheduler",
        playbackInterval,
        initialTimestamp,
      ],
      select: (
        data: InfiniteData<{
          granularity: number;
          start: string;
          end: string;
          data: SimulationStatistic[];
        }>,
      ) => {
        const allData = data.pages.map((page) => page.data).flat();
        return groupBy(allData, "timestamp");
      },
    },
  );

  const { data: jobs } = useQuery({
    queryKey: [
      "simulation",
      simulationId,
      "jobs",
      playbackInterval,
      initialTimestamp,
    ],
    select: (
      data: InfiniteData<{
        results: Job[];
        limit: number;
        offset: number;
        total_results: number;
      }>,
    ) => {
      return data.pages.map((page) => page.results).flat();
    },
  });

  if (
    !currentTimestamp ||
    !metrics ||
    isLoadingMetrics ||
    !schedulerStatistics
  ) {
    return <LoadingSpinner />;
  }

  let currentMetrics = metrics[currentTimestamp];
  if (!currentMetrics) {
    currentMetrics = Object.values(metrics)[0];
  }

  let currentStatistics = schedulerStatistics[currentTimestamp];
  if (!currentStatistics) {
    currentStatistics = Object.values(schedulerStatistics)[0];
  }

  return (
    <section className="grid grid-cols-12 gap-2 overflow-auto p-2">
      <PressureFlowRate metrics={currentMetrics} />
      <JobQueue
        jobs={
          jobs?.filter((job) => {
            return (
              isAfter(currentTimestamp, job.time_start) &&
              isBefore(currentTimestamp, job.time_end)
            );
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
