import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { ConsoleHeader } from "../../shared/simulation/consoleHeader";

const columns = [
  "CDU",
  "Rack 1 (kW)",
  "Rack 2 (kW)",
  "Rack 3 (kW)",
  "Sum (kW)",
  "Loss (kW)",
  "Facility Supply Temperature (°C)",
  "Facility Return Temperature (°C)",
  "Rack Supply Temperature (°C)",
  "Rack Return Temperature (°C)",
];

export function CDUList({ metrics }: { metrics: CoolingCDU[] }) {
  return (
    <div className="col-start-1 col-end-8 row-start-3 row-end-10">
      <ConsoleHeader>Power and Temperature</ConsoleHeader>
      <div className="border-2 text-sm">
        <div className="grid grid-cols-10 border-b-2 text-xs dark:text-neutral-200">
          {columns.map((col) => (
            <div
              className="flex items-end justify-center border-r-2 px-2"
              key={col}
            >
              <span
                className="overflow-hidden text-ellipsis text-center"
                title={col}
              >
                {col}
              </span>
            </div>
          ))}
        </div>
        {metrics.map((cdu, index) => (
          <div
            className="grid grid-cols-10 text-center"
            key={`${cdu.col}-${cdu.row}`}
          >
            <div className="border-r-2 text-cyan-500">{index + 1}</div>
            <div className="border-r-2 text-green-500">{cdu.rack_1_power}</div>
            <div className="border-r-2 text-green-500">{cdu.rack_2_power}</div>
            <div className="border-r-2 text-green-500">{cdu.rack_3_power}</div>
            <div className="border-r-2 text-green-500">{cdu.total_power}</div>
            <div className="border-r-2 text-green-500">{cdu.total_loss}</div>
            <div className="border-r-2 text-blue-500">
              {cdu.facility_supply_temp.toFixed(1)}
            </div>
            <div className="border-r-2 text-red-500">
              {cdu.facility_return_temp.toFixed(1)}
            </div>
            <div className="border-r-2 text-blue-500">
              {cdu.rack_supply_temp.toFixed(1)}
            </div>
            <div className=" text-red-500">
              {cdu.rack_return_temp.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
