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

export interface TimeSeriesParams {
  start?: string;
  end?: string;
  granularity?: number;
  resolution?: number;
}

export const simulationConfigurationQueryOptions = (simulationId: string) =>
  queryOptions({
    queryKey: ["simulation", "configuration", simulationId],
    queryFn: async (): Promise<Simulation> => {
      const res = await axios.get(`/frontier/simulation/${simulationId}`);

      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchInterval: (query) => query.state.data?.execution_end ? false : 5000,
  });

export const simulationCoolingCDUQueryOptions = (
  simulationId: string,
  params?: TimeSeriesParams,
) =>
  queryOptions({
    queryKey: ["simulation", "cooling", "cdu", simulationId, params],
    queryFn: async () => {
      const res = await axios.get<
        TimeSeriesResponse<CoolingCDU>
      >(`/frontier/simulation/${simulationId}/cooling/cdu`, { params: params });
      return res.data;
    },
    select: (data) => {
      let groupedTimeData =
        Object.entries(groupBy(data.data, "timestamp"))
          .map(([k, v]) => ({timestamp: k, cdus: v}));
      groupedTimeData = sortBy(groupedTimeData, "timestamp")
      return { ...data, data: groupedTimeData };
    },
    refetchInterval: 15000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

export const simulationSystemStatsQueryOptions = (
  simulationId: string,
  params: TimeSeriesParams = {},
) => queryOptions({
    queryKey: ["simulation", "system", "statistics", simulationId, params],
    queryFn: async () => {
      const res = await axios.get<
        TimeSeriesResponse<SimulationStatistic>
      >(`/frontier/simulation/${simulationId}/scheduler/system`, { params: params });
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
    staleTime: Infinity,
  });
