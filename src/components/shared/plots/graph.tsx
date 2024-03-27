import { Data, Layout } from "plotly.js";
import { useContext } from "react";
import Plot from "react-plotly.js";
import { AppContext } from "../../../App";
import { darkModeGraphLayout, lightModeGraphLayout } from "./graphLayouts";
import { merge } from "lodash";

export function Graph({
  data,
  layout,
}: {
  data: Partial<Data>[];
  layout?: Partial<Layout>;
}) {
  const { theme } = useContext(AppContext);
  const currentLayout =
    theme === "light" ? lightModeGraphLayout : darkModeGraphLayout;

  const _layout = {};
  merge(_layout, currentLayout, layout);

  return (
    <Plot
      layout={{
        ..._layout,
      }}
      data={data}
      className="w-full"
      config={{ displaylogo: false }}
    />
  );
}
