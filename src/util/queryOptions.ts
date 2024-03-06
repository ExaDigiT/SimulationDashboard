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

export const simulationCoolingCDUQueryOptions = (simulationId: string) =>
  queryOptions({
    queryKey: ["simulation", "cooling", "cdu", simulationId],
    queryFn: async () => {
      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        data: CoolingCDU[];
      }>(`/frontier/simulation/${simulationId}/cooling/cdu`);

      return res.data;
    },
    select: (data) => {
      const racks2d = groupBy(data.data, "timestamp");
      console.log(racks2d);
      return { ...data };
    },
  });
