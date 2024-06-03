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
    const startDate = new Date();
    startDate.setMilliseconds(0);
    this.start = startDate.toISOString();
    const endDate = new Date();
    endDate.setMilliseconds(0);
    this.end = endDate.toISOString();
    this.cooling = { enabled: false };
    this.scheduler = new Scheduler();
  }
}
