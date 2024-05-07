import { CustomJob } from "./CustomJob.model";

export type JobsMode = "replay" | "random" | "custom";

export interface IScheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs_mode: JobsMode;
  jobs: CustomJob[];
  seed: number | null;
  num_jobs: number | null;
}

export class Scheduler implements IScheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs: CustomJob[];
  jobs_mode: JobsMode;
  num_jobs: number | null;
  seed: number | null;

  constructor() {
    this.down_nodes = [];
    this.enabled = true;
    this.jobs = [];
    this.jobs_mode = "replay";
    this.num_jobs = null;
    this.seed = null;
  }
}
