import { Scheduler } from "./Scheduler.model";

export interface SimulationRequest {
  start: string;
  end: string;
  scheduler: Scheduler;
  cooling: {
    enabled: boolean;
  };
}
