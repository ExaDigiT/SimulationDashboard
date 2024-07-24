import { createFileRoute } from "@tanstack/react-router";
import { convertDateTimeString } from "../util/datetime";
import { useSuspenseQuery } from "@tanstack/react-query";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { Section } from "../components/shared/simulation/section";
import Box from "../components/shared/simulation/box";

export const Route = createFileRoute(
  "/simulations/$simulationId/configuration",
)({
  component: SimulationConfiguration,
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      simulationConfigurationQueryOptions(opts.params.simulationId),
    ),
});

function SimulationConfiguration() {
  const { simulationId } = Route.useParams();
  const { data, isLoading } = useSuspenseQuery(
    simulationConfigurationQueryOptions(simulationId),
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-8 py-8 dark:[color-scheme:dark]">
      <Section header="Status">
        <Box>
          <Box.Header>State</Box.Header>
          <Box.Value>
            {data.state.charAt(0).toLocaleUpperCase() + data.state.slice(1)}
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>Progress</Box.Header>
          <div className="group relative h-8 w-full rounded-full border-2 border-neutral-400 dark:border-neutral-900">
            <div
              className={`absolute left-0 top-0 flex h-full items-center justify-end rounded-full bg-blue-500 px-4 ${data.progress === 1 && `bg-green-500`}`}
              style={{ width: `${data.progress * 100}%` }}
            />
            <span
              className={`absolute right-3 z-10 text-white dark:text-neutral-200`}
            >
              {data.progress === 1
                ? "Complete"
                : `${(data.progress * 100).toFixed(1)}%`}
            </span>
          </div>
        </Box>
      </Section>
      <Section header="Timing">
        <Box>
          <Box.Header>Logical Start</Box.Header>
          <Box.Value>{convertDateTimeString(data.start)}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Logical End</Box.Header>
          <Box.Value>{convertDateTimeString(data.end)}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Run Start</Box.Header>
          <Box.Value>{convertDateTimeString(data.execution_start)}</Box.Value>
        </Box>
        <Box>
          <Box.Header>Run End</Box.Header>
          <Box.Value>
            {data.execution_end
              ? convertDateTimeString(data.execution_end)
              : "-"}
          </Box.Value>
        </Box>
      </Section>
      <Section header="Scheduler Configuration">
        <Box>
          <Box.Header>Enabled</Box.Header>
          <Box.Value>
            {`${data.config.scheduler.enabled}`.toUpperCase()}
          </Box.Value>
        </Box>
        <Box>
          <Box.Header>Job Mode</Box.Header>
          <Box.Value>
            {data.config.scheduler.jobs_mode.charAt(0).toUpperCase() +
              data.config.scheduler.jobs_mode.slice(1)}
          </Box.Value>
        </Box>
        {data.config.scheduler.jobs_mode === "random" ? (
          <>
            <Box>
              <Box.Header>Number of Jobs</Box.Header>
              <Box.Value>
                {data.config.scheduler.num_jobs?.toString() || "-"}
              </Box.Value>
            </Box>
            <Box>
              <Box.Header>Seed for Randomizer</Box.Header>
              <Box.Value>
                {data.config.scheduler.seed?.toString() || "-"}
              </Box.Value>
            </Box>
          </>
        ) : null}
      </Section>
      <Section header="Cooling Configuration">
        <Box>
          <Box.Header>Enabled</Box.Header>
          <Box.Value>
            {`${data.config.cooling.enabled}`.toUpperCase()}
          </Box.Value>
        </Box>
      </Section>
    </div>
  );
}
