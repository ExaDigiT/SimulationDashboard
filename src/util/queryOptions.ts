import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { Simulation } from "../models/Simulation.model";
import { CoolingCDU } from "../models/CoolingCDU.model";
import { groupBy, sortBy } from "lodash";
import { SimulationStatistic } from "../models/SimulationStatistic.model";

export interface ListResponse<T> {
  total_results: number;
  offset: number;
  limit: number;
  results: T[];
}

export interface TimeSeriesPoint {
  timestamp: string;
}
export interface TimeSeriesResponse<T extends TimeSeriesPoint = TimeSeriesPoint> {
  granularity: number;
  start: string;
  end: string;
  data: T[];
}

export const simulationConfigurationQueryOptions = (simulationId: string) =>
  queryOptions({
    queryKey: ["simulation", "configuration", simulationId],
    queryFn: async (): Promise<Simulation> => {
      const res = await axios.get(`/frontier/simulation/${simulationId}`);

      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchInterval: 15000,
  });

export const simulationCoolingCDUQueryOptions = (
  simulationId: string,
  filterParams?: {
    start?: string;
    end?: string;
    granularity?: number;
    resolution?: number;
  },
) =>
  queryOptions({
    enabled:
      !!filterParams &&
      (!!filterParams.resolution || !!filterParams.granularity),
    queryKey: ["simulation", "cooling", "cdu", simulationId, filterParams],
    queryFn: async () => {
      if (filterParams) {
        const res = await axios.get<
          TimeSeriesResponse<CoolingCDU>
        >(`/frontier/simulation/${simulationId}/cooling/cdu`, {
          params: {
            start: filterParams.start,
            end: filterParams.end,
            resolution: filterParams.resolution,
            granularity: filterParams.granularity,
          },
        });

        return res.data;
      }
      return null;
    },
    select: (data) => {
      if (data) {
        let groupedTimeData =
          Object.entries(groupBy(data.data, "timestamp"))
            .map(([k, v]) => ({timestamp: k, cdus: v}));
        groupedTimeData = sortBy(groupedTimeData, "timestamp")

        return { ...data, data: groupedTimeData };
      }
    },
    refetchInterval: 15000,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });

export const simulationSystemLatestStatsQueryOptions = ({
  simulationId,
  isFinal,
}: {
  simulationId: string;
  isFinal: boolean;
}) =>
  queryOptions({
    queryKey: ["simulation", "system", "statistics", simulationId, "latest"],
    queryFn: async () => {
      const res = await axios.get<
        TimeSeriesResponse<SimulationStatistic>
      >(`/frontier/simulation/${simulationId}/scheduler/system`);
      if (res.data.data.length > 0) {
        return res.data.data[0];
      }
      return null;
    },
    refetchInterval: isFinal ? false : 15000,
  });

export const simulationSystemStatsQueryOptions = ({
  simulationId,
  start,
  end,
}: {
  simulationId: string;
  start: string;
  end: string;
}) =>
  queryOptions({
    queryKey: ["simulation", "system", "statistics", simulationId, start, end],
    queryFn: async () => {
      const res = await axios.get<
        TimeSeriesResponse<SimulationStatistic>
      >(`/frontier/simulation/${simulationId}/scheduler/system`, {
        params: { resolution: 10 },
      });
      return res.data;
    },
  });

export const getFrontierSystemInformation = () =>
  queryOptions({
    queryKey: ["frontier", "system-info"],
    queryFn: async () => {
      const res = await axios.get<{
        peak_flops: number;
        peak_power: number;
        g_flops_w_peak: number;
      }>(`frontier/system-info`);
      return res.data;
    },
  });
