import { useEffect } from "react";
import { useQuery, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import { toDate,  isEqual as isDateEqual, min as minDate, addSeconds } from "date-fns";

import { Simulation } from "../../models/Simulation.model";
import { TimeSeriesPoint, TimeSeriesResponse, TimeSeriesParams } from "../queryOptions";
import { floorDate, snapDate, DateLike} from "../datetime";


export type UseReplayOptions<T extends TimeSeriesPoint> = {
  sim?: Simulation,
  query: (params: TimeSeriesParams) => UseQueryOptions<any, any, TimeSeriesResponse<T>, any>,
  timestamp?: Date,
  /** stepInterval in seconds */
  stepInterval: number,
  stepsPerQuery?: number,
  /** If set, will return a summary of whole simulation instead of a single time step */
  summarize?: boolean,
}

export type ReplayTimestamps = {
  maxTimestamp: Date,
  currentTimestamp: Date|undefined,
  nextTimestamp: Date|undefined,
}

export type UseReplayResult<T> = {
  data?: T,
  maxTimestamp: Date|undefined,
  currentTimestamp: Date|undefined,
  nextTimestamp: Date|undefined,
}


/**
 * Returns the maximum available timestamp in the simulation, snapped down to stepInterval.
 * Any stepInterval period starting before this timestamp should be complete.
 */
export const getMaxTimestamp = (sim: Simulation, stepInterval: number): Date => {
  return floorDate(sim.progress_date, stepInterval, sim.start)
}

/**
 * Snaps timestamp to stepInterval, and clamps it to the simulation start/end.
 * Returns the snapped timestamp and the nextTimestamp (if any)
 */
export const snapReplayTimestamp = (
  sim: Simulation, timestamp: DateLike, stepInterval: number,
): {
  currentTimestamp: Date,
  nextTimestamp: Date|undefined,
} => {
  const start = toDate(sim.start)
  // get the max step timestamp that is available, based on sim progress
  const maxTimestamp = getMaxTimestamp(sim, stepInterval)
  // snap timestamp to stepInterval and make sure its in range
  const currentTimestamp = snapDate(timestamp, start, maxTimestamp, stepInterval)
  let nextTimestamp: Date|undefined = addSeconds(currentTimestamp, stepInterval)
  if (nextTimestamp >= maxTimestamp) { // out of range
    nextTimestamp = undefined
  }
  
  return { currentTimestamp, nextTimestamp }
}

/**
 * Used to run through a timeseries endpoint one timestep at a time.
 * 
 * Pass the Simulation config, a timestamp, and a function that will generate the useQuery options
 * based on start/end params. It will return the data point corresponding to timestamp, and handles
 * batching/prefetching the requests to the endpoint.
 * 
 * If summarize is true, it will ignore timestamp and return a data point with aggregated results
 * from the whole simulation.
 */
export const useReplay = <T extends TimeSeriesPoint>({
  sim, query, timestamp, stepInterval, stepsPerQuery = 100, summarize = false,
}: UseReplayOptions<T>): UseReplayResult<T> => {
  const queryClient = useQueryClient()

  // We return one timestep datum at a time, but we don't want to launch a new query for every
  // time point. So we query chunks of the timeseries at once, and let react-query cache the queries.
  const maxTimestamp = sim ? getMaxTimestamp(sim, stepInterval) : undefined;
  const {
    currentTimestamp, nextTimestamp,
  } = (sim && timestamp && !summarize) ? snapReplayTimestamp(sim, timestamp, stepInterval) : {};

  // compute the chunk of the query we need to get timestamp
  const querySize = stepInterval * stepsPerQuery
  let queryStart: Date, queryEnd: Date;
  let granularityOptions: TimeSeriesParams;
  let enabled: boolean

  if (sim && summarize) {
    [queryStart, queryEnd] = [toDate(sim.start), maxTimestamp!];
    granularityOptions = {resolution: 1};
    enabled = true;
  } else if (sim && currentTimestamp) {
    queryStart = floorDate(currentTimestamp, querySize, sim.start)
    queryEnd = minDate([addSeconds(queryStart, querySize), maxTimestamp!])
    granularityOptions = {granularity: stepInterval};
    enabled = true;
  } else {
    [queryStart, queryEnd] = [toDate(0), toDate(0)]; // Just a placeholder
    granularityOptions = {resolution: 1};
    enabled = false;
  }

  const queryResult = useQuery({
    ...query({
      start: queryStart.toISOString(), end: queryEnd.toISOString(),
      ...granularityOptions,
    }),
    enabled: enabled,
    // keep previous data to make UI transition smoothly
    placeholderData: (prevData, _prevQuery) => prevData,
    // We've capped queryStart/queryEnd to progress, so we know that all data should be complete
    // for the query. queryEnd will increase as progress increases, changing the queryKey
    staleTime: Infinity,
  })

  let data: T|undefined;
  if (summarize) {
    data = queryResult.data?.data?.[0];
  } else if (currentTimestamp) {
    data = queryResult.data?.data?.find(d => isDateEqual(d.timestamp, currentTimestamp));
  }

  // Prefetch the next query
  useEffect(() => {
    if (sim && !summarize && currentTimestamp) {
      const nextQueryStart = addSeconds(queryStart, querySize)
      if (nextQueryStart < maxTimestamp!) {
        const nextQueryEnd = minDate([addSeconds(nextQueryStart, querySize), maxTimestamp!])
        queryClient.prefetchQuery({
          ...query({
            start: nextQueryStart.toISOString(), end: nextQueryEnd.toISOString(),
            granularity: stepInterval,
          }),
          staleTime: Infinity,
        })
      }
    }
  })

  return { data, maxTimestamp, currentTimestamp, nextTimestamp }
}

