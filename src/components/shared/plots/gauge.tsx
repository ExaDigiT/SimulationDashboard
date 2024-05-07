import { useContext } from "react";
import ReactGauge from "react-gauge-component";
import { AppContext } from "../../../App";
import { GaugeComponentProps } from "react-gauge-component/dist/lib/GaugeComponent/types/GaugeComponentProps";
import { merge } from "lodash";
import colors from "tailwindcss/colors";

const lightGauge: Partial<GaugeComponentProps> = {
  labels: {
    tickLabels: {
      defaultTickLineConfig: { color: colors.neutral[900] },
      defaultTickValueConfig: { style: { fill: colors.neutral[900] } },
    },
    valueLabel: {
      style: {
        fill: colors.neutral[600],
      },
    },
  },
};

export function Gauge(props: Partial<GaugeComponentProps>) {
  const { theme } = useContext(AppContext);

  const baseGauge = theme === "light" ? lightGauge : {};

  const gauge = {};
  merge(gauge, baseGauge, props);

  return <ReactGauge key={theme} {...gauge} />;
}
