import { GraphHeader } from "../../shared/plots/graphHeader";
import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { CoolingCEP } from "../../../models/CoolingCEP.model"
import { Gauge } from "../../shared/plots/gauge";
import { SimulationStatistic } from "../../../models/SimulationStatistic.model";
import { useQuery } from "@tanstack/react-query";
import { getFrontierSystemInformation } from "../../../util/queryOptions";
import { LoadingSpinner } from "../../shared/loadingSpinner";
import { sumBy } from "lodash";

function round(x: number|null|undefined, fractionDigits: number) {
  return Number(x?.toFixed(fractionDigits) ?? 0)
}

function GaugeWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center">
      {props.children}
    </div>
  );
}

export function SimulationGauges({
  cdus = [], cep, statistics,
}: {
  cdus?: CoolingCDU[];
  cep?: CoolingCEP;
  statistics?: SimulationStatistic;
}) {
  const { data } = useQuery(getFrontierSystemInformation());
  if (!data) {
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="flex flex-col">
        <GaugeWrapper>
          <GraphHeader>Total Power</GraphHeader>
          <Gauge
            minValue={0}
            maxValue={35000}
            value={round(sumBy(cdus, c => c.total_power), 2)}
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
            value={round(sumBy(cdus, c => c.total_loss), 2)}
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
      </div>
      <div className="flex flex-col">
        <GaugeWrapper>
          <GraphHeader>Performance</GraphHeader>
          <Gauge
            minValue={0}
            maxValue={2000}
            value={round(statistics?.p_flops, 2)}
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [
                  {
                    value: 2000,
                  },
                ],
              },
              valueLabel: {
                formatTextValue: (value) => value + " PFlop/s",
              },
            }}
            arc={{
              colorArray: ["#5BE12C"],
              subArcs: [
                {
                  color: "#5BE12C",
                  limit: 2000,
                },
              ],
            }}
          />
        </GaugeWrapper>
        <GaugeWrapper>
          <GraphHeader>Efficency</GraphHeader>
          <Gauge
            minValue={0}
            maxValue={data?.g_flops_w_peak ?? 2}
            value={statistics?.g_flops_w ?? 0}
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [
                  { value: round(data?.g_flops_w_peak, 2) },
                ],
              },
              valueLabel: {
                formatTextValue: (value) => value + " GFlops/watts",
              },
            }}
            arc={{
              colorArray: ["#5BE12C"],
              subArcs: [{ color: "#5BE12C", limit: data?.g_flops_w_peak ?? 2 }],
            }}
          />
        </GaugeWrapper>
      </div>
      <div className="flex flex-col">
        <GaugeWrapper>
          <GraphHeader>Temperature</GraphHeader>
          <Gauge
            minValue={5}
            maxValue={50}
            value={cep ?
              round((cep.htw_return_temp + cep.htw_supply_temp + cep.ctw_return_temp + cep.ctw_supply_temp) / 4, 2)
              : 0
            }
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [{ value: 20 }, { value: 35 }],
                defaultTickValueConfig: {
                  formatTextValue: (value) => value + " ºC",
                },
              },
              valueLabel: {
                formatTextValue: (value) => (value ? value : "-") + " ºC",
              },
            }}
            arc={{
              subArcs: [
                {
                  limit: 10,
                  color: "#EA4228",
                  showTick: true,
                  tooltip: { text: "Low Temperature" },
                },
                {
                  limit: 12,
                  color: "#F5CD19",
                  showTick: true,
                  tooltip: { text: "Approaching Low Temperature" },
                },
                { limit: 43, color: "#5BE12C", showTick: true },
                {
                  limit: 45,
                  color: "#F5CD19",
                  showTick: true,
                  tooltip: { text: "Approaching High Temperature" },
                },
                {
                  limit: 50,
                  color: "#EA4228",
                  tooltip: { text: "High Temperature" },
                },
              ],
            }}
          />
        </GaugeWrapper>
        <GaugeWrapper>
          <GraphHeader>Pressure</GraphHeader>
          <Gauge
            minValue={10}
            maxValue={90}
            value={cep ?
              round((cep.htw_return_pressure + cep.htw_supply_pressure + cep.ctw_return_pressure + cep.ctw_supply_pressure) / 4, 2)
              : 0
            }
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [{ value: 35 }, { value: 50 }, { value: 65 }],
              },
              valueLabel: {
                formatTextValue: (value) => (value ? value : "-") + " psig",
              },
            }}
            arc={{
              subArcs: [
                {
                  limit: 20,
                  color: "#EA4228",
                  tooltip: { text: "Low Pressure" },
                  showTick: true,
                },
                {
                  limit: 25,
                  color: "#F5CD19",
                  tooltip: { text: "Approaching Low Pressure" },
                  showTick: true,
                },
                { color: "#5BE12C", limit: 75, showTick: true },
                {
                  limit: 80,
                  color: "#F5CD19",
                  tooltip: { text: "Approaching High Pressure" },
                  showTick: true,
                },
                {
                  limit: 90,
                  color: "#EA4228",
                  tooltip: { text: "High Pressure" },
                },
              ],
            }}
          />
        </GaugeWrapper>
      </div>
    </>
  );
}
