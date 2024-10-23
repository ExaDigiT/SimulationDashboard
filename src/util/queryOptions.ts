import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { Simulation } from "../models/Simulation.model";
import { CoolingCDU } from "../models/CoolingCDU.model";
import { CoolingCEP } from "../models/CoolingCEP.model";
import { Job } from "../models/Job.model";
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
    staleTime: (query) => query.state.data?.execution_end ? Infinity : 1000,
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
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

export const simulationCoolingCEPQueryOptions = (
  simulationId: string,
  params: TimeSeriesParams = {},
) => queryOptions({
    queryKey: ["simulation", "cooling", "cep", simulationId, params],
    queryFn: async () => {
      const res = await axios.get<
        TimeSeriesResponse<CoolingCEP>
      >(`/frontier/simulation/${simulationId}/cooling/cep`, { params: params });
      return res.data;
    },
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

/**
 * Query jobs from the job endpoint.
 * sort should be passed as a list like ["desc:name", "asc:job_id"]
 * filters is in the format ["job_id=eq:5"]
 * TODO: allow passing sort/filters in cleaner format than raw query params.
 */
export const simulationSchedulerJobs = (
  simulationId: string,
  params?: {
    start?: string, end?: string,
    limit?: number, offset?: number,
    fields?: string[], sort?: string[],
    filters?: string[],
    currentTimestamp?: string,
  }
) => {
  let searchParams: string[] = []
  // axios adds `[]` to array params so we'll serialize it manually instead
  searchParams.push(...(params?.sort?.map(s => `sort=${s}`) ?? []));
  // Just specify filters as an array of ["job_id=eq:1"] for now
  searchParams.push(...(params?.filters ?? []));

  return queryOptions({
    queryKey: ["simulation", "scheduler", "jobs", simulationId, params],
    queryFn: async () => {
      const res = await axios.get<{
        offset: number; limit: number, total_results: number, results: Job[];
      }>(`/frontier/simulation/${simulationId}/scheduler/jobs?${searchParams.join("&")}`, {
        params: {
          start: params?.start, end: params?.end,
          limit: params?.limit, offset: params?.offset,
          fields: params?.fields?.join(","),
        },
      });
      return res.data;
    },
  })
}

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
