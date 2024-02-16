export interface Job {
  name: string;
  allocation_nodes: number;
  time_submission: string;
  time_limit: string;
  cpu_util: number;
  gpu_util: number;
  cpu_trace: number[];
  gpu_trace: number[];
  end_state:
    | "COMPLETED"
    | "PENDING"
    | "RUNNING"
    | "CANCELLED"
    | "COMPLETING"
    | "BOOT_FAIL"
    | "CONFIGURING"
    | "DEADLINE"
    | "FAILED"
    | "NODE_FAIL"
    | "OUT_OF_MEMORY"
    | "PREEMPTED"
    | "RESV_DEL_HOLD"
    | "REQUEUE_FED"
    | "REQUEUE_HOLD"
    | "REQUEUED"
    | "RESIZING"
    | "REVOKED"
    | "SINGALING"
    | "SPECIAL_EXIT"
    | "STAGE_OUT"
    | "STOPPED"
    | "SUSPENDED"
    | "TIMEOUT";
}
