import { SimulationRequest } from "./SimulationRequest.model";

export interface Simulation {
  id: string;
  user: string;
  state: "running" | "success" | "fail";
  start: string;
  end: string;
  execution_start: string;
  execution_end: string | null;
  progress: number;
  config: SimulationRequest;
}
