import { Scheduler } from "./Scheduler.model";

export interface ISimulationRequest {
  start: string;
  end: string;
  scheduler: Scheduler;
  cooling: {
    enabled: boolean;
  };
}

export class SimulationRequest implements ISimulationRequest {
  start: string;
  end: string;
  scheduler: Scheduler;
  cooling: { enabled: boolean };

  constructor() {
    this.start = new Date().toISOString();
    this.end = new Date().toISOString();
    this.cooling = { enabled: false };
    this.scheduler = new Scheduler();
  }
}
