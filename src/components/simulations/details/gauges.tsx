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

export function SimulationGauges({ metrics }: { metrics?: CoolingCDU[] }) {
  return (
    <>
      <GaugeWrapper>
        <GraphHeader>Total Power</GraphHeader>
        <Gauge
          minValue={0}
          maxValue={35000}
          value={
            metrics?.reduce((prev, curr) => prev + curr.total_power, 0) ?? 0
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
        <GraphHeader>Total Loss</GraphHeader>
        <Gauge
          minValue={0}
          maxValue={2000}
          value={
            metrics?.reduce((prev, curr) => prev + curr.total_loss, 0) ?? 0
          }
          labels={{
            tickLabels: {
              type: "outer",
              ticks: [{ value: 500 }, { value: 1000 }, { value: 1500 }],
            },
            valueLabel: {
              formatTextValue: (value) => value + " kW",
            },
          }}
          arc={{
            colorArray: ["#5BE12C"],
            subArcs: [{ color: "#5BE12C", limit: 2000 }],
          }}
        />
      </GaugeWrapper>
      <GaugeWrapper>
        <GraphHeader>HTWS/HTWR CTWS/CTWR Temperature</GraphHeader>
        <Gauge
          minValue={0}
          maxValue={100}
          value={
            (metrics?.reduce(
              (prev, curr) => prev + curr.htwr_htws_ctwr_ctws_temp,
              0,
            ) ?? 0) /
            (metrics?.filter((metric) => !!metric.htwr_htws_ctwr_ctws_temp)
              .length ?? 0)
          }
          labels={{
            tickLabels: {
              type: "outer",
              ticks: [{ value: 25 }, { value: 50 }, { value: 75 }],
              defaultTickValueConfig: {
                formatTextValue: (value) => value + " ºC",
              },
            },
            valueLabel: {
              formatTextValue: (value) => value + " ºC",
            },
          }}
          arc={{
            colorArray: ["#5BE12C"],
            subArcs: [{ color: "#5BE12C", limit: 100 }],
          }}
        />
      </GaugeWrapper>
      <GaugeWrapper>
        <GraphHeader>HTWS/HTWR CTWS/CTWR Pressure</GraphHeader>
        <Gauge
          minValue={0}
          maxValue={150}
          value={
            (metrics?.reduce(
              (prev, curr) => prev + curr.htwr_htws_ctwr_ctws_pressure,
              0,
            ) ?? 0) /
            (metrics?.filter((metric) => !!metric.htwr_htws_ctwr_ctws_pressure)
              .length ?? 0)
          }
          labels={{
            tickLabels: {
              type: "outer",
              ticks: [{ value: 25 }, { value: 50 }, { value: 75 }],
            },
            valueLabel: {
              formatTextValue: (value) => value + " psi",
            },
          }}
          arc={{
            colorArray: ["#5BE12C"],
            subArcs: [{ color: "#5BE12C", limit: 100 }],
          }}
        />
      </GaugeWrapper>
    </>
  );
}
