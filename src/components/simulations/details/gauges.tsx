import { Dictionary } from "lodash";
import { GraphHeader } from "../../shared/plots/graphHeader";
import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { Gauge } from "../../shared/plots/gauge";

function GaugeWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center">
      {props.children}
    </div>
  );
}

export function SimulationGauges(props: {
  latestMetrics?: {
    data: Dictionary<CoolingCDU[]>;
    granularity: number;
    start: string;
    end: string;
  };
}) {
  return (
    <>
      <GaugeWrapper>
        <GraphHeader>Total Power</GraphHeader>
        <Gauge
          minValue={0}
          maxValue={35000}
          value={
            Object.values(props.latestMetrics?.data || [])
              .map((timestamp) =>
                timestamp.reduce((prev, curr) => prev + curr.total_power, 0),
              )
              .reduce((prev, curr) => prev + curr, 0) || 0
          }
          labels={{
            tickLabels: {
              type: "outer",
              ticks: [
                { value: 5000 },
                { value: 10000 },
                { value: 15000 },
                { value: 20000 },
                { value: 25000 },
                { value: 30000 },
              ],
            },
            valueLabel: {
              formatTextValue: (value) => value + " kW",
            },
          }}
          arc={{
            colorArray: ["#5BE12C"],
            subArcs: [{ color: "#5BE12C", limit: 35000 }],
          }}
        />
      </GaugeWrapper>
      <GaugeWrapper>
        <GraphHeader>HTWS/HTWR CTWS/CTWR Temperature</GraphHeader>
        <Gauge
          minValue={0}
          maxValue={150}
          value={
            Object.values(props.latestMetrics?.data || [])
              .map((timestamp) =>
                timestamp.reduce(
                  (prev, curr) => prev + curr.htwr_htws_ctwr_ctws_temp,
                  0,
                ),
              )
              .reduce((prev, curr) => prev + curr, 0) || 0
          }
          labels={{
            tickLabels: {
              type: "outer",
              ticks: [{ value: 50 }, { value: 100 }],
            },
            valueLabel: {
              formatTextValue: (value) => value + " ºC",
            },
          }}
          arc={{
            colorArray: ["#5BE12C"],
            subArcs: [{ color: "#5BE12C", limit: 150 }],
          }}
        />
      </GaugeWrapper>
    </>
  );
}
