import { createFileRoute } from "@tanstack/react-router";
import { simulationCoolingCDUQueryOptions } from "../util/queryOptions";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { Graph } from "../components/shared/plots/graph";
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
    }),
  );

  return (
    <div className={`flex-1 overflow-y-auto dark:[color-scheme:dark]`}>
      <TimeStepBar />
      {!data || isLoading ? (
        <LoadingSpinner />
      ) : (
        <div
          className={`pr-2 ${theme === "light" ? "bg-white" : "bg-transparent"}`}
        >
          <Graph
            key="Total Power Usage Graph"
            data={[
              {
                x: Object.keys(data.data),
                y: Object.values(data.data).map((timestamp) =>
                  timestamp.reduce((prev, curr) => prev + curr.total_power, 0),
                ),
                type: "scatter",
                mode: "lines+markers",
                hovertemplate: "%{x}<br />Power: %{y} kW<extra></extra>",
                yaxis: "y",
                line: {
                  shape: "spline",
                  smoothing: 1.3,
                },
              },
            ]}
            layout={{
              title: "Total Power Usage",
              xaxis: { title: { text: "Time" }, type: "date" },
              yaxis: {
                title: { text: "Power (kW)", standoff: 20 },
                type: "linear",
              },
            }}
          />
          <Graph
            key="Total Power Loss Graph"
            data={[
              {
                x: Object.keys(data.data),
                y: Object.values(data.data).map((timestamp) =>
                  timestamp.reduce((prev, curr) => prev + curr.total_loss, 0),
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
            layout={{
              title: "Total Power Loss",
              xaxis: { title: { text: "Time" } },
              yaxis: { title: { text: "Power (kW)", standoff: 20 } },
            }}
          />
          <Graph
            key="Average Rack Temp Graph"
            data={[
              {
                x: Object.keys(data.data),
                y: Object.values(data.data).map(
                  (timestamp) =>
                    timestamp.reduce(
                      (prev, curr) => prev + curr.rack_return_temp,
                      0,
                    ) / 25,
                ),
                type: "scatter",
                mode: "lines+markers",
                hovertemplate:
                  "%{x}<br />Average Rack Supply Temperature: %{y} °C<extra></extra>",
                line: {
                  shape: "spline",
                  smoothing: 1.3,
                },
                name: "Return Temperature",
              },
              {
                x: Object.keys(data.data),
                y: Object.values(data.data).map(
                  (timestamp) =>
                    timestamp.reduce(
                      (prev, curr) => prev + curr.rack_supply_temp,
                      0,
                    ) / 25,
                ),
                type: "scatter",
                mode: "lines+markers",
                hovertemplate:
                  "%{x}<br />Average Rack Supply Temperature: %{y} °C<extra></extra>",
                line: {
                  shape: "spline",
                  smoothing: 1.3,
                },
                name: "Supply Temperature",
              },
            ]}
            layout={{
              title: "Average Rack Temperatures",
              xaxis: { title: { text: "Time" } },
              yaxis: { title: { text: "Temperature (°C)", standoff: 20 } },
            }}
          />
          <Graph
            key="Average Flowrate Graph"
            data={[
              {
                x: Object.keys(data.data),
                y: Object.values(data.data).map(
                  (timestamp) =>
                    timestamp.reduce(
                      (prev, curr) => prev + curr.rack_flowrate,
                      0,
                    ) / 25,
                ),
                type: "scatter",
                mode: "lines+markers",
                hovertemplate:
                  "%{x}<br />Average Rack Flowrate: %{y} gpm<extra></extra>",
                line: {
                  shape: "spline",
                  smoothing: 1.3,
                },
              },
            ]}
            layout={{
              title: "Average Rack Flowrate",
              xaxis: { title: { text: "Time" } },
              yaxis: { title: { text: "Flowrate (gpm)", standoff: 20 } },
            }}
          />
        </div>
      )}
    </div>
  );
}
