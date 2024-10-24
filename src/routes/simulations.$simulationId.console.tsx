import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PressureFlowRate } from "../components/simulations/console/pressureFlowRate";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { JobQueue } from "../components/simulations/console/jobQueue";
import { CDUList } from "../components/simulations/console/cduList";
import { Power } from "../components/simulations/console/power";
import { Scheduler } from "../components/simulations/console/scheduler";
import { toDate } from "date-fns";
import {
  simulationConfigurationQueryOptions, simulationSystemStatsQueryOptions,
  simulationCoolingCDUQueryOptions, simulationCoolingCEPQueryOptions,
  simulationSchedulerJobs,
} from "../util/queryOptions";
import { computeJobState } from "../util/jobs";
import { useReplay } from "../util/hooks/useReplay";
import { Job } from "../models/Job.model";


export const Route = createFileRoute("/simulations/$simulationId/console")({
  component: SimulationConsoleView,
});

function SimulationConsoleView() {
  const { simulationId } = Route.useParams();
  const search = Route.useSearch();
  const currentTimestamp = search.currentTimestamp ? toDate(search.currentTimestamp) : undefined;

  const { data: sim } = useQuery(simulationConfigurationQueryOptions(simulationId))

  const { data: schedulerStatistics } = useReplay({
    sim: sim,
    query: (params) => simulationSystemStatsQueryOptions(simulationId, params),
    timestamp: currentTimestamp,
    stepInterval: search.playbackInterval,
    summarize: !currentTimestamp,
  })
  
  const { data: cdus } = useReplay({
    sim: sim,
    query: (params) => simulationCoolingCDUQueryOptions(simulationId, params),
    timestamp: currentTimestamp,
    stepInterval: search.playbackInterval,
    summarize: !currentTimestamp,
  })
  
  const { data: cep } = useReplay({
    sim: sim,
    query: (params) => simulationCoolingCEPQueryOptions(simulationId, params),
    timestamp: currentTimestamp,
    stepInterval: search.playbackInterval,
    summarize: !currentTimestamp,
  })

  const { data: jobs } = useQuery({
    ...simulationSchedulerJobs(simulationId, {
      // TODO: should use an "infiniteQuery" or something in case you have a lot of jobs in a simulation
      limit: 1000,
      fields: [
        'job_id', 'name', 'node_count', 'state_current', 'time_limit', 'time_start', 'time_end',
        'time_submission',
      ],
    }),
    select: (data) => (
      data
        .results
        .map(j => ({...j, state_current: computeJobState(j, currentTimestamp)}))
        .filter(j => j.state_current != "UNSUBMITTED")
    ) as Job[]
  });

  return (
    <section className="grid min-w-[1024px] grid-cols-12 gap-2 overflow-auto p-2">
      {cdus ? (
        <PressureFlowRate metrics={cdus.cdus} />
      ): (<LoadingSpinner/>)}
      {jobs ? (
        <JobQueue jobs={jobs} />
      ) : (<LoadingSpinner/>)}
      {cdus ? (
        <CDUList metrics={cdus.cdus} />
      ) : (<LoadingSpinner/>)}
      {cdus && cep ? (
        <Power cdus={cdus.cdus} cep={cep}/>
      ) : (<LoadingSpinner/>)}
      {schedulerStatistics ? (
        <Scheduler statistics={schedulerStatistics} />
      ) : (<LoadingSpinner/>)}
    </section>
  );
}
