import { createFileRoute } from "@tanstack/react-router";
import { convertDateTimeString } from "../util/datetime";
import { useSuspenseQuery } from "@tanstack/react-query";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";

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
    <span className="font-medium text-lg border-b-2 pb-2 border-neutral-800">
      {children}
    </span>
  );
}

function ConfigurationSection({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div className="grid grid-cols-2 items-center gap-y-4">{children}</div>
  );
}

function ConfigurationPart({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function ConfigurationPartHeader({ children }: { children: string }) {
  return <p className="text-md text-neutral-600">{children}:</p>;
}

function ConfigurationPartValue({ children }: { children: string }) {
  return <p className="text-lg">{children}</p>;
}

function SimulationConfiguration() {
  const { simulationId } = Route.useParams();
  const { data } = useSuspenseQuery(
    simulationConfigurationQueryOptions(simulationId)
  );

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
          <div className="relative h-8 w-full rounded-full border-2">
            <div
              className="absolute top-0 left-0 bg-blue-500 h-full rounded-full flex items-center justify-end px-4 group"
              style={{ width: `${data.progress * 100}%` }}
            >
              <span className="text-white group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                {data.progress * 100}%
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
            {convertDateTimeString(data.logical_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.logical_end)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.run_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {data.run_end ? convertDateTimeString(data.run_end) : "-"}
          </ConfigurationPartValue>
        </ConfigurationPart>
      </ConfigurationSection>
      <ConfigurationHeader>Job Configuration</ConfigurationHeader>
      <ConfigurationSection>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.logical_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.logical_end)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.run_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {data.run_end ? convertDateTimeString(data.run_end) : "-"}
          </ConfigurationPartValue>
        </ConfigurationPart>
      </ConfigurationSection>
      <ConfigurationSection>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.logical_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Logical End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.logical_end)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run Start</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {convertDateTimeString(data.run_start)}
          </ConfigurationPartValue>
        </ConfigurationPart>
        <ConfigurationPart>
          <ConfigurationPartHeader>Run End</ConfigurationPartHeader>
          <ConfigurationPartValue>
            {data.run_end ? convertDateTimeString(data.run_end) : "-"}
          </ConfigurationPartValue>
        </ConfigurationPart>
      </ConfigurationSection>
    </div>
  );
}
