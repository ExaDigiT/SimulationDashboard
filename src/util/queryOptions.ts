import { queryOptions } from "@tanstack/react-query";
import axios from "axios";
import { Simulation } from "../models/Simulation.model";
import { CoolingCDU } from "../models/CoolingCDU.model";
import { groupBy } from "lodash";

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
  });

export const simulationCoolingCDUQueryOptions = (
  simulationId: string,
  filterParams?: {
    start: string;
    end: string;
    granularity?: number;
    resolution?: number;
  }
) =>
  queryOptions({
    enabled: !!filterParams,
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
  });
