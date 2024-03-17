import { createFileRoute } from "@tanstack/react-router";
import {
  simulationConfigurationQueryOptions,
  simulationCoolingCDUQueryOptions,
} from "../util/queryOptions";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { LineGraph } from "../components/shared/plots/lineGraph";
import { Select } from "../components/shared/dropdown";
import { useState } from "react";

type CoolingSearch = {
  start: string;
  end: string;
  resolution?: number;
  granularity?: number;
};

export const Route = createFileRoute("/simulations/$simulationId/cooling")({
  component: SimulationCooling,
  validateSearch: (search: Record<string, unknown>): CoolingSearch => {
    return {
      start: (search.start as string) || new Date().toISOString(),
      end: (search.end as string) || new Date().toISOString(),
      resolution: Number(search.resolution) || undefined,
      granularity: Number(search.granularity) || undefined,
    };
  },
  loader: async (opts) => {
    const res = await opts.context.queryClient.ensureQueryData(
      simulationConfigurationQueryOptions(opts.params.simulationId)
    );
    opts.navigate({ search: { start: res.start, end: res.end } });
  },
});

const defaultResolution = 10;
const defaultGranularity = 1.0;

function SimulationCooling() {
  const { simulationId } = Route.useParams();
  const { granularity, resolution, start, end } = Route.useSearch();
  const { data: configuration, isLoading: isLoadingConfiguration } = useQuery(
    simulationConfigurationQueryOptions(simulationId)
  );
  const { data, isLoading } = useQuery(
    simulationCoolingCDUQueryOptions(
      simulationId,
      configuration
        ? {
            start: start,
            end: end,
            resolution: resolution,
            granularity: granularity,
          }
        : undefined
    )
  );
  const [timestepType, setTimestepType] = useState<
    "resolution" | "granularity"
  >("resolution");

  if (!data || isLoading || isLoadingConfiguration) return <LoadingSpinner />;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 flex items-center">
        <span className="text-neutral-200 mr-2">Timestep Type:</span>
        <Select
          value={timestepType}
          choices={[
            { label: "Resolution", value: "resolution" },
            { label: "Granularity", value: "granularity" },
          ]}
          onChange={(e) => {
            setTimestepType(e.target.value as "resolution" | "granularity");
          }}
        />
      </div>
      <LineGraph
        data={[
          {
            x: Object.keys(data.data),
            y: Object.values(data.data).map((timestamp) =>
              timestamp.reduce((prev, curr) => prev + curr.total_power, 0)
            ),
            type: "scatter",
            mode: "lines+markers",
            hovertemplate: "%{x}<br />Power: %{y} kW<extra></extra>",
          },
        ]}
        title="Total Power Usage"
      />
      <LineGraph
        data={[
          {
            x: Object.keys(data.data),
            y: Object.values(data.data).map((timestamp) =>
              timestamp.reduce((prev, curr) => prev + curr.total_loss, 0)
            ),
            type: "scatter",
            mode: "lines+markers",
            hovertemplate: "%{x}<br />Power: %{y} kW<extra></extra>",
          },
        ]}
        title="Total Power Loss"
      />
    </div>
  );
}
