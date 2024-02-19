import { Job } from "./Job.model";

export interface Scheduler {
  enabled: boolean;
  down_nodes: string[];
  jobs_mode: "replay" | "custom" | "random";
  jobs: Job[];
  seed: number | null;
  num_jobs: number | null;
}
