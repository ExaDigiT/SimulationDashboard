import { createFileRoute } from "@tanstack/react-router";
import { simulationCoolingCDUQueryOptions } from "../util/queryOptions";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { LineGraph } from "../components/shared/plots/lineGraph";
import { TimeStepBar } from "../components/cooling/timeStepBar";
import { useContext } from "react";
import { AppContext } from "../App";

type CoolingSearch = {
  start: string;
  end: string;
  timestepType: "resolution" | "granularity";
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
      timestepType:
        (search.timestepType as "resolution" | "granularity") || "resolution",
    };
  },
});

function SimulationCooling() {
  const { theme } = useContext(AppContext);
  const { simulationId } = Route.useParams();
  const { granularity, resolution, start, end } = Route.useSearch();
  const { data, isLoading } = useQuery(
    simulationCoolingCDUQueryOptions(simulationId, {
      start: start,
      end: end,
      resolution: resolution,
      granularity: granularity,
    })
  );

  return (
    <div className={`flex-1 overflow-y-auto`}>
      <TimeStepBar />
      {!data || isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className={`pr-2 ${theme === "light" ? "bg-neutral-50" : "bg-transparent"}`}
        >
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
                line: {
                  shape: "spline",
                  smoothing: 1.3,
                },
              },
            ]}
            title="Total Power Usage"
            xAxisTitle={{ text: "Time" }}
            yAxisTitle={{ text: "Power (kW)", standoff: 20 }}
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
                line: {
                  shape: "spline",
                  smoothing: 1.3,
                },
              },
            ]}
            title="Total Power Loss"
            xAxisTitle={{ text: "Time" }}
            yAxisTitle={{ text: "Power (kW)", standoff: 20 }}
          />
        </div>
      )}
    </div>
  );
}
