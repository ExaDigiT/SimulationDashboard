import { Data, Layout } from "plotly.js";
import Plot from "react-plotly.js";
import colors from "tailwindcss/colors";

const darkModeGraphLayout: Partial<Layout> = {
  autosize: true,
  hovermode: "closest",
  title: undefined,
  xaxis: {
    title: "Time",
    titlefont: { color: colors.neutral[200] },
    type: "date",
    gridcolor: colors.neutral[400],
    color: colors.neutral[200],
  },
  yaxis: {
    title: "Power (kW)",
    titlefont: { color: colors.neutral[200] },
    type: "linear",
    tickformat: ".0f",
    gridcolor: colors.neutral[400],
    color: colors.neutral[200],
  },
  plot_bgcolor: colors.neutral[800],
  paper_bgcolor: colors.neutral[800],
  titlefont: { color: colors.neutral[200] },
};

export function LineGraph({
  title,
  data,
}: {
  title?: string;
  data: Partial<Data>[];
}) {
  return (
    <Plot
      layout={{
        ...darkModeGraphLayout,
        title: title,
        colorway: [colors.blue[500]],
      }}
      data={data}
      className="w-full"
    />
  );
}
