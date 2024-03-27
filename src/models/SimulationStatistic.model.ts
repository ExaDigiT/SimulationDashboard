export interface SimulationStatistic {
  timestamp: string;
  down_nodes: string[];
  num_samples: number;
  jobs_completed: number;
  jobs_running: number;
  jobs_pending: number;
  throughput: number;
  average_power: number;
  average_loss: number;
  system_power_efficiency: number;
  total_energy_consumed: number;
  carbon_emissions: number;
  total_cost: number;
}
