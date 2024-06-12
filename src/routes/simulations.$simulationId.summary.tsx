import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { Section } from "../components/shared/simulation/section";
import Box from "../components/shared/simulation/box";
import { SimulationGauges } from "../components/simulations/details/gauges";
import { isEqual, subSeconds } from "date-fns";
import { useReplayCooling, useReplayScheduler } from "../util/hooks/useReplay";

export const Route = createFileRoute("/simulations/$simulationId/summary")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    start: string;
    end: string;
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
  const { currentTimestamp, playbackInterval, initialTimestamp, end, start } =
    Route.useSearch();
  const { data: configurationData } = useQuery(
    simulationConfigurationQueryOptions(simulationId),
  );
  const isFinal = configurationData?.progress === 1;

  const { data: schedulerStatistics, isLoading } = useReplayScheduler({
    simulationId,
    currentTimestamp,
    playbackInterval,
    initialTimestamp,
    end,
    start,
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useReplayCooling({
    currentTimestamp,
    playbackInterval,
    start,
    end,
    initialTimestamp,
    simulationId,
  });

  if (isLoading || !schedulerStatistics || !currentTimestamp || !metrics) {
    return <LoadingSpinner />;
  }

  let currentMetrics = metrics.data[currentTimestamp];
  if (!currentMetrics) {
    currentMetrics = Object.values(metrics.data)[0];
  }

  let currentStatistics = schedulerStatistics.find((timestep) =>
    isEqual(
      timestep.timestamp,
      isEqual(currentTimestamp, end)
        ? subSeconds(end, playbackInterval).toISOString()
        : currentTimestamp,
    ),
  );

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
          <Box.Value>{currentStatistics?.jobs_pending ?? "-"}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Jobs Running</Box.Header>
          <Box.Value>{currentStatistics?.jobs_running ?? "-"}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Jobs Completed</Box.Header>
          <Box.Value>{currentStatistics?.jobs_completed ?? "-"}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Job Throughput</Box.Header>
          <Box.Value>{currentStatistics?.throughput ?? "-"} Jobs/Hr</Box.Value>
        </Box>
        <Box>
          <Box.Header>Average Power Usage</Box.Header>
          <Box.Value>
            {currentStatistics?.average_power
              ? currentStatistics.average_power / 1000000
              : "-"}{" "}
            mW
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>Average Power Loss</Box.Header>
          <Box.Value>
            {currentStatistics?.average_loss
              ? currentStatistics.average_loss / 1000000
              : "-"}{" "}
            mW
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>Total Power Consumption</Box.Header>
          <Box.Value>
            {currentStatistics?.total_energy_consumed ?? "-"} mW
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>System Power Efficiency</Box.Header>
          <Box.Value>
            {currentStatistics?.system_power_efficiency ?? "-"}%
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>Carbon Emissions</Box.Header>
          <Box.Value>
            {currentStatistics?.carbon_emissions ?? "-"} Metric Tons of CO2
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>Total Cost</Box.Header>
          <Box.Value>
            {currentStatistics?.total_cost
              ? Intl.NumberFormat("en-US", {
                  currency: "USD",
                  style: "currency",
                }).format(currentStatistics.total_cost)
              : "-"}
          </Box.Value>
        </Box>
      </Section>
    </div>
  );
}
