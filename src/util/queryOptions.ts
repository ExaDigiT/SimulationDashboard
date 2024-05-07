import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { Simulation } from "../models/Simulation.model";
import { CoolingCDU } from "../models/CoolingCDU.model";
import { groupBy } from "lodash";
import { SimulationStatistic } from "../models/SimulationStatistic.model";

export interface ListResponse<T> {
  total_results: number;
  offset: number;
  limit: number;
  results: T[];
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
        const res = await axios.get<{
          granularity: number;
          start: string;
          end: string;
          data: CoolingCDU[];
        }>(`/frontier/simulation/${simulationId}/cooling/cdu`, {
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
        const groupedTimeData = groupBy(data.data, "timestamp");

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
      const res = await axios.get<{
        start: string;
        end: string;
        granularity: number;
        data: SimulationStatistic[];
      }>(`/frontier/simulation/${simulationId}/scheduler/system`);
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
      const res = await axios.get<{
        start: string;
        end: string;
        granularity: number;
        data: SimulationStatistic[];
      }>(`/frontier/simulation/${simulationId}/scheduler/system`, {
        params: { resolution: 10 },
      });
      return res.data;
    },
  });
