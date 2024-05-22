import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { ConsoleHeader } from "../../shared/simulation/consoleHeader";

export function Power({ metrics }: { metrics: CoolingCDU[] }) {
  return (
    <div className="col-start-1 col-end-8 row-start-10 row-end-11">
      <ConsoleHeader>Power Stats</ConsoleHeader>
      <div className="grid grid-cols-4 text-center dark:text-neutral-200">
        <span className="text-green-500">Total Power</span>
        <span className="text-green-500">Total Loss</span>
        <span className="text-green-500">Percent Loss</span>
        <span className="text-green-500">PUE</span>
        <span>
          {(
            metrics.reduce((prev, curr) => prev + curr.total_power, 0) / 10000
          ).toFixed(3)}{" "}
          mW
        </span>
        <span>
          {(
            metrics.reduce((prev, curr) => prev + curr.total_loss, 0) / 10000
          ).toFixed(3)}{" "}
          mW
        </span>
        <span>
          {(
            (metrics.reduce((prev, curr) => prev + curr.total_loss, 0) /
              metrics.reduce((prev, curr) => prev + curr.total_power, 0)) *
            100
          ).toFixed(2)}
          %
        </span>
        <span>
          {metrics.reduce((prev, curr) => prev + curr.pue_output, 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
