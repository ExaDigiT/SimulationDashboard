import { CustomJob } from "./CustomJob.model";

export type JobsMode = "replay" | "random" | "custom";

export interface IScheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs_mode: JobsMode;
  schedule_policy: 'fcfs'|'sjf'|'prq'
  reschedule: boolean
  jobs: CustomJob[];
  seed: number | null;
  num_jobs: number | null;
}

export class Scheduler implements IScheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs: CustomJob[];
  jobs_mode: JobsMode;
  schedule_policy: 'fcfs'|'sjf'|'prq'
  reschedule: boolean
  seed: number | null;
  num_jobs: number | null;

  constructor() {
    this.down_nodes = [];
    this.enabled = true;
    this.jobs = [];
    this.jobs_mode = "replay";
    this.schedule_policy = 'fcfs';
    this.reschedule = false;
    this.num_jobs = null;
    this.seed = null;
  }
}
