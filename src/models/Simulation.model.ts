import { SimulationRequest } from "./SimulationRequest.model";

export interface Simulation {
  id: string;
  user: string;
  state: "running" | "success" | "fail";
  logical_start: string;
  logical_end: string;
  run_start: string;
  run_end: string | null;
  progress: number;
  config: SimulationRequest;
}
