import { InfiniteData, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  simulationConfigurationQueryOptions,
  simulationSystemLatestStatsQueryOptions,
} from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { Section } from "../components/shared/simulation/section";
import Box from "../components/shared/simulation/box";
import { SimulationGauges } from "../components/simulations/details/gauges";
import { CoolingCDU } from "../models/CoolingCDU.model";
import { groupBy } from "lodash";

export const Route = createFileRoute("/simulations/$simulationId/summary")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    start: string;
    end: string | null;
    currentTimestamp: string;
    playbackInterval: number;
    initialTimestamp: string;
  } => {
    return {
      start: (search.start as string) || new Date().toISOString(),
      end: (search.end as string) || new Date().toISOString(),
      currentTimestamp: search.currentTimestamp as string,
      playbackInterval: (search.playbackInterval as number) || 15,
      initialTimestamp: search.initialTimestamp as string,
    };
  },
  component: SimulationSummary,
});

function SimulationSummary() {
  const { simulationId } = Route.useParams();
  const { currentTimestamp, playbackInterval, initialTimestamp } =
    Route.useSearch();
  const { data: configurationData } = useQuery(
    simulationConfigurationQueryOptions(simulationId),
  );
  const isFinal = configurationData?.progress === 1;

  const { data, isLoading } = useQuery(
    simulationSystemLatestStatsQueryOptions({ simulationId, isFinal }),
  );

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: [
      "simulation",
      simulationId,
      "cooling",
      playbackInterval,
      initialTimestamp,
    ],
    select: (
      data: InfiniteData<{
        granularity: number;
        start: string;
        end: string;
        data: CoolingCDU[];
      }>,
    ) => {
      const allData = data.pages.map((page) => page.data).flat();
      return groupBy(allData, "timestamp");
    },
  });

  if (isLoading || !data || !currentTimestamp || !metrics) {
    return <LoadingSpinner />;
  }

  let currentMetrics = metrics[currentTimestamp];
  if (!currentMetrics) {
    currentMetrics = Object.values(metrics)[0];
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-8">
      <Section header="Metrics" sectionProps={{ className: "grid-cols-3" }}>
        {isLoadingMetrics ? (
          <LoadingSpinner />
        ) : (
          <SimulationGauges metrics={currentMetrics} />
        )}
      </Section>
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
    </div>
  );
}
