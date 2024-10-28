import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { PressureFlowRate } from "../components/simulations/console/pressureFlowRate";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { JobQueue } from "../components/simulations/console/jobQueue";
import { CDUList } from "../components/simulations/console/cduList";
import { Power } from "../components/simulations/console/power";
import { Scheduler } from "../components/simulations/console/scheduler";
import { Message } from "../components/shared/simulation/message";
import { toDate, differenceInSeconds, addSeconds, subSeconds, min as minDate } from "date-fns";
import {
  simulationConfigurationQueryOptions, simulationSystemStatsQueryOptions,
  simulationCoolingCDUQueryOptions, simulationCoolingCEPQueryOptions,
  simulationSchedulerJobs,
} from "../util/queryOptions";
import { computeJobState } from "../util/jobs";
import { useReplay } from "../util/hooks/useReplay";
import { Job } from "../models/Job.model";
import { floorDate } from "../util/datetime";


export const Route = createFileRoute("/simulations/$simulationId/console")({
  component: SimulationConsoleView,
});

function SimulationConsoleView() {
  const { simulationId } = Route.useParams();
  const search = Route.useSearch();
  const currentTimestamp = search.currentTimestamp ? toDate(search.currentTimestamp) : undefined;

  const { data: sim } = useQuery(simulationConfigurationQueryOptions(simulationId))

  const { maxTimestamp, data: schedulerStatistics } = useReplay({
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

  const jobPageSize = search.playbackInterval * 100;
  // how long completed jobs will stay in the chart
  const jobLingerTime = search.playbackInterval * 5
  let jobQueryStart: Date|undefined, jobQueryEnd: Date|undefined;
  if (sim && currentTimestamp && maxTimestamp) {
    jobQueryStart = subSeconds(floorDate(currentTimestamp, jobPageSize, sim.start), jobLingerTime)
    jobQueryEnd = minDate([addSeconds(jobQueryStart, jobPageSize + jobLingerTime), maxTimestamp])
  }

  const { data: jobsRaw } = useQuery({
    ...simulationSchedulerJobs(simulationId, {
      start: jobQueryStart?.toISOString(), end: jobQueryEnd?.toISOString(),
      limit: 1000,
      fields: [
        'job_id', 'name', 'node_count', 'state_current', 'time_limit', 'time_start', 'time_end',
        'time_submission',
      ],
    }),
    placeholderData: (prevData, _prevQuery) => prevData,
    staleTime: Infinity, // We're capping queries to maxTimestamp so they should always be valid
  });

  let jobs = (
    jobsRaw?.results
      .map(j => ({...j, state_current: computeJobState(j, currentTimestamp)}))
      // Filter out unsubmitted jobs, and completed jobs after a few steps
      .filter(j => 
        j.state_current != "UNSUBMITTED" &&
        (!currentTimestamp || !j.time_end || differenceInSeconds(currentTimestamp, j.time_end) > jobLingerTime)
      )
  ) as Job[];
  jobs = sortBy(jobs, j => j.state_current != "RUNNING", j => j.state_current, j => j.job_id)

  return (
    <section className="grid min-w-[1024px] grid-cols-12 gap-2 overflow-auto p-2">
      {(sim && sim.progress_date == sim.start) ? (
        <Message>No data available {sim.state == 'running' ? 'yet' : ''}</Message>
      ) : (<>
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
      </>)}
    </section>
  );
}
