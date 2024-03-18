import { createFileRoute } from "@tanstack/react-router";
import { convertDateTimeString } from "../util/datetime";
import { useSuspenseQuery } from "@tanstack/react-query";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";
import { ReactNode } from "react";
import { LoadingSpinner } from "../components/shared/loadingSpinner";

export const Route = createFileRoute(
  "/simulations/$simulationId/configuration"
)({
  component: SimulationConfiguration,
  loader: (opts) =>
    opts.context.queryClient.ensureQueryData(
      simulationConfigurationQueryOptions(opts.params.simulationId)
    ),
});

function ConfigurationHeader({ children }: { children: JSX.Element | string }) {
  return (
    <span className="font-medium text-lg border-b-2 pb-2 border-neutral-200 text-neutral-200">
      {children}
    </span>
  );
}

function ConfigurationSection({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-y-4">{children}</div>
  );
}

function ConfigurationPart({
  children,
}: {
  children: JSX.Element | JSX.Element[] | null;
}) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function ConfigurationPartHeader({ children }: { children: string }) {
  return <p className="text-md text-neutral-400">{children}:</p>;
}

function ConfigurationPartValue({ children }: { children: string }) {
  return <p className="text-lg text-neutral-300">{children}</p>;
}

function SimulationConfiguration() {
  const { simulationId } = Route.useParams();
  const { data, isFetching } = useSuspenseQuery(
    simulationConfigurationQueryOptions(simulationId)
  );

  if (isFetching) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col px-8 py-8 gap-4 overflow-y-auto">
      <ConfigurationHeader>Status</ConfigurationHeader>
      <ConfigurationSection>
        <ConfigurationPart>
          <ConfigurationPartHeader>State</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {data.state.charAt(0).toLocaleUpperCase() + data.state.slice(1)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Progress</ConfigurationPartHeader>
          <div className="relative h-8 w-full rounded-full border-2 border-neutral-200">
            <div
              className={`absolute top-0 left-0 bg-blue-500 h-full rounded-full flex items-center justify-end px-4 group ${data.progress === 1 && `bg-green-500`}`}
              style={{ width: `${data.progress * 100}%` }}
            >
              <span
                className={`text-neutral-200 group-hover:opacity-100 opacity-0 transition-opacity duration-300 ${data.progress === 1 && "opacity-100"}`}
              >
                {data.progress === 1 ? "Complete" : `${data.progress * 100}%`}
              </span>
            </div>
          </div>
        </ConfigurationPart>
      </ConfigurationSection>
      <ConfigurationHeader>Timing</ConfigurationHeader>
      <ConfigurationSection>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.end)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.execution_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {data.execution_end
              ? convertDateTimeString(data.execution_end)
              : "-"}
          </ConfigurationPartValue>
        </ConfigurationPart>
      </ConfigurationSection>
      <ConfigurationHeader>Scheduler Configuration</ConfigurationHeader>
      <ConfigurationSection>
        <ConfigurationPart>
          <ConfigurationPartHeader>Enabled</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {`${data.config.scheduler.enabled}`.toUpperCase()}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Job Mode</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {data.config.scheduler.jobs_mode.charAt(0).toUpperCase() +
              data.config.scheduler.jobs_mode.slice(1)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        {data.config.scheduler.jobs_mode === "random" ? (
          <>
            <ConfigurationPart>
              <ConfigurationPartHeader>Number of Jobs</ConfigurationPartHeader>
              <ConfigurationPartValue>
                {data.config.scheduler.num_jobs?.toString() || "-"}
              </ConfigurationPartValue>
            </ConfigurationPart>
            <ConfigurationPart>
              <ConfigurationPartHeader>
                Seed for Randomizer
              </ConfigurationPartHeader>
              <ConfigurationPartValue>
                {data.config.scheduler.seed?.toString() || "-"}
              </ConfigurationPartValue>
            </ConfigurationPart>
          </>
        ) : null}
      </ConfigurationSection>
      <ConfigurationHeader>Cooling Configuration</ConfigurationHeader>
      <ConfigurationSection>
        <ConfigurationPart>
          <ConfigurationPartHeader>Enabled</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {`${data.config.cooling.enabled}`.toUpperCase()}
          </ConfigurationPartValue>
        </ConfigurationPart>
      </ConfigurationSection>
    </div>
  );
}
