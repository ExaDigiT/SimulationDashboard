import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  simulationConfigurationQueryOptions,
  simulationSystemLatestStatsQueryOptions,
  simulationSystemStatsQueryOptions,
} from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { Section } from "../components/shared/simulation/section";
import Box from "../components/shared/simulation/box";
//import { Graph } from "../components/shared/plots/graph";

export const Route = createFileRoute("/simulations/$simulationId/summary")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { start: string; end: string } => {
    return {
      start: (search.start as string) || new Date().toISOString(),
      end: (search.end as string) || new Date().toISOString(),
    };
  },
  component: SimulationSummary,
});

function SimulationSummary() {
  const { simulationId } = Route.useParams();
  const { start, end } = Route.useSearch();
  const { data: configurationData } = useQuery(
    simulationConfigurationQueryOptions(simulationId),
  );
  const isFinal = configurationData?.progress === 1;

  const { data, isLoading } = useQuery(
    simulationSystemLatestStatsQueryOptions({ simulationId, isFinal }),
  );
  const { isLoading: isLoadingSummaryData } = useQuery(
    simulationSystemStatsQueryOptions({ simulationId, start, end }),
  );

  if (isLoading || !data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-8">
      <Section header={isFinal ? "Final Projections" : "Latest Projections"}>
        <Box>
          <Box.Header>Jobs Pending</Box.Header>
          <Box.Value>{data.jobs_pending}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Jobs Running</Box.Header>
          <Box.Value>{data.jobs_running}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Jobs Completed</Box.Header>
          <Box.Value>{data.jobs_completed}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Job Throughput</Box.Header>
          <Box.Value>{data.throughput} Jobs/Hr</Box.Value>
        </Box>
        <Box>
          <Box.Header>Average Power Usage</Box.Header>
          <Box.Value>{data.average_power / 1000000} mW</Box.Value>
        </Box>
        <Box>
          <Box.Header>Average Power Loss</Box.Header>
          <Box.Value>{data.average_loss / 1000000} mW</Box.Value>
        </Box>
        <Box>
          <Box.Header>Total Power Consumption</Box.Header>
          <Box.Value>{data.total_energy_consumed} mW</Box.Value>
        </Box>
        <Box>
          <Box.Header>System Power Efficiency</Box.Header>
          <Box.Value>{data.system_power_efficiency}%</Box.Value>
        </Box>
        <Box>
          <Box.Header>Carbon Emissions</Box.Header>
          <Box.Value>{data.carbon_emissions} Metric Tons of CO2</Box.Value>
        </Box>
        <Box>
          <Box.Header>Total Cost</Box.Header>
          <Box.Value>
            {Intl.NumberFormat("en-US", {
              currency: "USD",
              style: "currency",
            }).format(data.total_cost)}
          </Box.Value>
        </Box>
      </Section>
      <Section header="Projections over Time">
        {isLoadingSummaryData ? <LoadingSpinner /> : <div></div>}
      </Section>
    </div>
  );
}
