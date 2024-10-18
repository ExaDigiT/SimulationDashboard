import { CoolingCDU } from "../../../models/CoolingCDU.model";
import { ConsoleHeader } from "../../shared/simulation/consoleHeader";

export function Power({ metrics }: { metrics: CoolingCDU[] }) {
  return (
    <div className="col-start-1 col-end-8 row-start-1 row-end-2">
      <ConsoleHeader>Power Stats</ConsoleHeader>
      <div className="grid grid-cols-4 text-center dark:text-neutral-200">
        <span className="border-2 border-neutral-400 bg-neutral-300 text-green-500 dark:border-neutral-900 dark:bg-neutral-700">
          Total Power
        </span>
        <span className="border-2 border-l-0 border-neutral-400 bg-neutral-300 text-green-500 dark:border-neutral-900 dark:bg-neutral-700">
          Total Loss
        </span>
        <span className="border-2 border-l-0 border-neutral-400 bg-neutral-300 text-green-500 dark:border-neutral-900 dark:bg-neutral-700">
          Percent Loss
        </span>
        <span className="border-2 border-l-0 border-neutral-400 bg-neutral-300 text-green-500 dark:border-neutral-900 dark:bg-neutral-700">
          PUE
        </span>
        <span className="border-2 border-t-0 border-neutral-400 dark:border-neutral-900">
          {metrics
            .reduce((prev, curr) => prev + curr.total_power, 0)
            .toFixed(2)}{" "}
          kW
        </span>
        <span className="border-2 border-l-0 border-t-0 border-neutral-400 dark:border-neutral-900">
          {metrics.reduce((prev, curr) => prev + curr.total_loss, 0).toFixed(2)}{" "}
          kW
        </span>
        <span className="border-2 border-l-0 border-t-0 border-neutral-400 dark:border-neutral-900">
          {(
            (metrics.reduce((prev, curr) => prev + curr.total_loss, 0) /
              metrics.reduce((prev, curr) => prev + curr.total_power, 0)) *
            100
          ).toFixed(2)}
          %
        </span>
        {/* <span className="border-2 border-l-0 border-t-0 border-neutral-400 dark:border-neutral-900"> TODO:
          {metrics.reduce((prev, curr) => prev + curr.pue_output, 0).toFixed(2)}
        </span> */}
      </div>
    </div>
  );
}
