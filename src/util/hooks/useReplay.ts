import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  addSeconds,
  differenceInSeconds,
  isBefore,
  subSeconds,
} from "date-fns";
import { CoolingCDU } from "../../models/CoolingCDU.model";
import { SimulationStatistic } from "../../models/SimulationStatistic.model";
import { groupBy } from "lodash";
import { Job } from "../../models/Job.model";

export const useReplayCooling = ({
  simulationId,
  playbackInterval,
  initialTimestamp,
  start,
  end,
  currentTimestamp,
}: {
  simulationId: string;
  playbackInterval: number;
  initialTimestamp: string;
  start: string;
  end: string;
  currentTimestamp: string;
}) => {
  return useInfiniteQuery({
    queryKey: [
      "simulation",
      simulationId,
      "cooling",
      playbackInterval,
      "replay",
      initialTimestamp,
    ],
    initialPageParam: differenceInSeconds(initialTimestamp, start),
    getNextPageParam: (
      _lastPage: unknown,
      _allPages: unknown[],
      lastPageParam: number,
    ): null | number => {
      const currentEndTime = addSeconds(
        start,
        playbackInterval * 20 + lastPageParam,
      );
      if (isBefore(currentEndTime, end)) {
        return lastPageParam + playbackInterval * 20;
      }
      return null;
    },
    queryFn: async ({ pageParam }) => {
      const startTime = addSeconds(start, pageParam);
      const currentEndTime = addSeconds(
        start,
        playbackInterval * 20 + pageParam,
      );
      const isEnd = differenceInSeconds(currentTimestamp, end) === 0;
      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        data: CoolingCDU[];
      }>(`/frontier/simulation/${simulationId}/cooling/cdu`, {
        params: {
          start: isBefore(startTime, end) ? startTime : undefined,
          end: isBefore(currentEndTime, end) ? currentEndTime : end,
          granularity: isEnd ? undefined : playbackInterval,
          resolution: isEnd ? 1 : undefined,
        },
      });

      return res.data;
    },
    refetchOnWindowFocus: false,
    select: (
      data: InfiniteData<{
        granularity: number;
        start: string;
        end: string;
        data: CoolingCDU[];
      }>,
    ) => {
      const allData = data.pages.map((page) => page.data).flat();
      return {
        data: groupBy(allData, "timestamp"),
        pageParams: data.pageParams,
      };
    },
  });
};

export const useReplayScheduler = ({
  simulationId,
  playbackInterval,
  initialTimestamp,
  start,
  end,
  currentTimestamp,
}: {
  simulationId: string;
  playbackInterval: number;
  initialTimestamp: string;
  start: string;
  end: string;
  currentTimestamp: string;
}) => {
  return useInfiniteQuery({
    queryKey: [
      "simulation",
      simulationId,
      "scheduler",
      playbackInterval,
      "replay",
      initialTimestamp,
    ],
    initialPageParam: differenceInSeconds(initialTimestamp, start),
    getNextPageParam: (
      _lastPage: unknown,
      _allPages: unknown[],
      lastPageParam: number,
    ): null | number => {
      const currentEndTime = addSeconds(
        start,
        playbackInterval * 20 + lastPageParam,
      );
      if (isBefore(currentEndTime, end)) {
        return lastPageParam + playbackInterval * 20;
      }
      return null;
    },
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam }) => {
      const startTime = addSeconds(start, pageParam);
      const currentEndTime = addSeconds(
        start,
        playbackInterval * 20 + pageParam,
      );
      const isEnd = differenceInSeconds(currentTimestamp, end) === 0;

      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        data: SimulationStatistic[];
      }>(`/frontier/simulation/${simulationId}/scheduler/system`, {
        params: {
          start: isBefore(startTime, end)
            ? startTime
            : subSeconds(end, playbackInterval).toISOString(),
          end: isBefore(currentEndTime, end) ? currentEndTime : end,
          granularity: isEnd ? undefined : playbackInterval,
          resolution: isEnd ? 1 : undefined,
        },
      });

      return res.data;
    },
    select: (
      data: InfiniteData<{
        granularity: number;
        start: string;
        end: string;
        data: SimulationStatistic[];
      }>,
    ) => {
      return data.pages.map((page) => page.data).flat();
    },
  });
};

export const useReplayJobs = ({
  simulationId,
  playbackInterval,
  initialTimestamp,
  start,
  end,
}: {
  simulationId: string;
  playbackInterval: number;
  initialTimestamp: string;
  start: string;
  end: string;
}) => {
  return useInfiniteQuery({
    queryKey: [
      "simulation",
      simulationId,
      "jobs",
      playbackInterval,
      "replay",
      initialTimestamp,
    ],
    getNextPageParam: (
      _lastPage: unknown,
      _allPages: unknown[],
      lastPageParam: number,
    ): null | number => {
      const currentEndTime = addSeconds(
        start,
        playbackInterval * 20 + lastPageParam,
      );
      if (isBefore(currentEndTime, end)) {
        return lastPageParam + playbackInterval * 20;
      }
      return null;
    },
    initialPageParam: differenceInSeconds(initialTimestamp, start),
    queryFn: async ({ pageParam }) => {
      const startTime = addSeconds(start, pageParam);
      const currentEndTime = addSeconds(
        start,
        playbackInterval * 20 + pageParam,
      );
      const fields = `fields=job_id&fields=name&fields=node_count&fields=state_current&fields=time_limit&fields=time_start&fields=time_end&fields=time_submission`;
      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        results: Job[];
      }>(`/frontier/simulation/${simulationId}/scheduler/jobs?${fields}`, {
        params: {
          start: isBefore(startTime, end) ? startTime : undefined,
          end: isBefore(currentEndTime, end) ? currentEndTime : end,
        },
      });

      return res.data;
    },
    refetchOnWindowFocus: false,
    select: (
      data: InfiniteData<{
        granularity: number;
        start: string;
        end: string;
        results: Job[];
      }>,
    ) => {
      return data.pages.map((page) => page.results).flat();
    },
  });
};
