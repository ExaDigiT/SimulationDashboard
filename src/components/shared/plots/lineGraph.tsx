import { Data, DataTitle, Layout } from "plotly.js";
import { useContext } from "react";
import Plot from "react-plotly.js";
import colors from "tailwindcss/colors";
import { AppContext } from "../../../App";

const darkModeGraphLayout: Partial<Layout> = {
  autosize: true,
  hovermode: "closest",
  title: undefined,
  xaxis: {
    title: "",
    titlefont: { color: colors.neutral[200] },
    type: "date",
    gridcolor: colors.neutral[400],
    color: colors.neutral[200],
  },
  yaxis: {
    title: "",
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

const lightModeGraphLayout: Partial<Layout> = {
  autosize: true,
  hovermode: "closest",
  title: undefined,
  xaxis: {
    title: "",
    titlefont: { color: colors.neutral[800] },
    type: "date",
    gridcolor: colors.neutral[500],
    color: colors.neutral[800],
  },
  yaxis: {
    title: "",
    titlefont: { color: colors.neutral[800] },
    type: "linear",
    tickformat: ".0f",
    gridcolor: colors.neutral[500],
    color: colors.neutral[800],
  },
  plot_bgcolor: colors.neutral[50],
  paper_bgcolor: colors.neutral[50],
  titlefont: { color: colors.neutral[800] },
};

export function LineGraph({
  title,
  data,
  yAxisTitle,
  xAxisTitle,
  layout,
}: {
  title?: string;
  data: Partial<Data>[];
  yAxisTitle?: Partial<DataTitle>;
  xAxisTitle?: Partial<DataTitle>;
  layout?: Partial<Layout>;
}) {
  const { theme } = useContext(AppContext);
  const currentLayout =
    theme === "light" ? lightModeGraphLayout : darkModeGraphLayout;

  return (
    <Plot
      layout={{
        ...currentLayout,
        title: title,
        colorway: [colors.blue[500], colors.red[500]],
        yaxis: { ...currentLayout.yaxis, title: yAxisTitle },
        xaxis: { ...currentLayout.xaxis, title: xAxisTitle },
        margin: { l: 100, r: 80 },
        ...layout,
      }}
      data={data}
      className="w-full"
      config={{ displaylogo: false }}
    />
  );
}
