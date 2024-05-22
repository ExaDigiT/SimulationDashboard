import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { ConsoleHeader } from "../../shared/simulation/consoleHeader";

const statistics = [
  {
    name: "Work Done by CDUPs (kW)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce((prev, curr) => prev + curr.work_done_by_cdup, 0) ?? 0) /
      25,
  },
  {
    name: "Facility Supply Pressure (psig)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce(
        (prev, curr) => prev + curr.facility_supply_pressure,
        0,
      ) ?? 0) / 25,
  },
  {
    name: "Facility Return Pressure (psig)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce(
        (prev, curr) => prev + curr.facility_return_pressure,
        0,
      ) ?? 0) / 25,
  },
  {
    name: "Facility Flowrate (gpm)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce((prev, curr) => prev + curr.facility_flowrate, 0) ?? 0) /
      25,
  },
  {
    name: "Rack Supply Pressure (psig)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce((prev, curr) => prev + curr.rack_supply_pressure, 0) ??
        0) / 25,
  },
  {
    name: "Rack Return Pressure (psig)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce((prev, curr) => prev + curr.rack_return_pressure, 0) ??
        0) / 25,
  },
  {
    name: "Rack Flowrate (gpm)",
    value: (metrics: CoolingCDU[]) =>
      (metrics?.reduce((prev, curr) => prev + curr.rack_flowrate, 0) ?? 0) / 25,
  },
];

export function PressureFlowRate({ metrics }: { metrics: CoolingCDU[] }) {
  return (
    <div className="col-start-1 col-end-8 row-start-1 row-end-3">
      <ConsoleHeader>Pressure and Flow Rates</ConsoleHeader>
      <div className="border-2">
        <div className="flex w-full border-b-2 text-xs">
          <span className="flex-1 px-2 dark:text-neutral-200">Output</span>
          <div className="w-[2px] dark:bg-neutral-300" />
          <span className="flex-1 text-center dark:text-neutral-200">
            Average Value
          </span>
        </div>
        <div className="flex flex-col">
          {statistics.map((stat) => (
            <div className="flex text-sm dark:text-neutral-200" key={stat.name}>
              <span className="flex-1 px-2">{stat.name}</span>
              <div className="w-[2px] dark:bg-neutral-300" />
              <span className="flex-1 text-center">
                {stat.value(metrics).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
