import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { simulationSystemLatestStatsQueryOptions } from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { Header } from "../components/shared/simulation/header";
import { Section } from "../components/shared/simulation/section";
import Box from "../components/shared/simulation/box";

export const Route = createFileRoute("/simulations/$simulationId/summary")({
  component: SimulationSummary,
});

function SimulationSummary() {
  const { simulationId } = Route.useParams();
  const { data, isLoading } = useQuery(
    simulationSystemLatestStatsQueryOptions({ simulationId })
  );

  if (isLoading || !data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col px-8 py-8 gap-4 overflow-y-auto">
      <Header>Latest Projections</Header>
      <Section>
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
          <Box.Value>{data.average_power} MW</Box.Value>
        </Box>
        <Box>
          <Box.Header>Average Power Loss</Box.Header>
          <Box.Value>{data.average_loss} MW</Box.Value>
        </Box>
        <Box>
          <Box.Header>Total Power Consumption</Box.Header>
          <Box.Value>{data.total_energy_consumed} MW</Box.Value>
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
    </div>
  );
}
