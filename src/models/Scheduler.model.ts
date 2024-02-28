import { Job } from "./Job.model";

export type JobsMode = "replay" | "random" | "custom";

export interface IScheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs_mode: JobsMode;
  jobs: Job[];
  seed: number | null;
  num_jobs: number | null;
}

export class Scheduler implements IScheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs: Job[];
  jobs_mode: JobsMode;
  num_jobs: number | null;
  seed: number | null;

  constructor() {
    this.down_nodes = [];
    this.enabled = false;
    this.jobs = [];
    this.jobs_mode = "replay";
    this.num_jobs = null;
    this.seed = null;
  }
}
