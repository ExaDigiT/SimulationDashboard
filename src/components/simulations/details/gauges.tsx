import { GraphHeader } from "../../shared/plots/graphHeader";
import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { Gauge } from "../../shared/plots/gauge";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import colors from "tailwindcss/colors";

function GaugeWrapper(props: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col items-center">
      {props.children}
    </div>
  );
}

const tempData = [
  { value: 12.5, name: "CPU" },
  { value: 50, name: "GPU" },
  { value: 37.5, name: "Cooling" },
];

const pieChartFills = [
  colors.orange[500],
  colors.blue[500],
  "#5BE12C",
  colors.purple[500],
];

export function SimulationGauges({ metrics }: { metrics?: CoolingCDU[] }) {
  return (
    <>
      <div className="flex flex-col">
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
      </div>
      <div className="flex h-full w-full items-center justify-center">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={tempData} dataKey="value" valueKey="name">
              <LabelList dataKey={"name"} />
              {tempData.map((d, i) => (
                <Cell
                  style={{ outline: "none" }}
                  key={d.name}
                  fill={pieChartFills[i]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col">
        <GaugeWrapper>
          <GraphHeader>HTWS/HTWR CTWS/CTWR Temperature</GraphHeader>
          <Gauge
            minValue={5}
            maxValue={50}
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
                ticks: [{ value: 20 }, { value: 35 }],
                defaultTickValueConfig: {
                  formatTextValue: (value) => value + " ºC",
                },
              },
              valueLabel: {
                formatTextValue: (value) => value + " ºC",
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
          <GraphHeader>HTWS/HTWR CTWS/CTWR Pressure</GraphHeader>
          <Gauge
            minValue={10}
            maxValue={90}
            value={
              (metrics?.reduce(
                (prev, curr) => prev + curr.htwr_htws_ctwr_ctws_pressure,
                0,
              ) ?? 0) /
              (metrics?.filter(
                (metric) => !!metric.htwr_htws_ctwr_ctws_pressure,
              ).length ?? 0)
            }
            labels={{
              tickLabels: {
                type: "outer",
                ticks: [{ value: 35 }, { value: 50 }, { value: 65 }],
              },
              valueLabel: {
                formatTextValue: (value) => value + " psig",
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
