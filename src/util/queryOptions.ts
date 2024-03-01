import { queryOptions } from "@tanstack/react-query";
import { SimulationRequest } from "../models/SimulationRequest.model";

export const simulationConfigurationQueryOptions = (simulationId: string) =>
  queryOptions({
    queryKey: ["simulation", "configuration", simulationId],
    queryFn: () => {
      return {
        config: {} as SimulationRequest,
        id: simulationId,
        logical_end: "2024-02-28T03:06:30.646Z",
        logical_start: "2024-02-27T03:06:30.646Z",
        run_start: "2024-02-27T03:06:30.646Z",
        run_end: null,
        progress: 0.9,
        state: "running",
        user: "Tyler Webb",
      };
    },
  });
