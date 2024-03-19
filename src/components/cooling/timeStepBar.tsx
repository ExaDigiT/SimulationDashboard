import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Select } from "../shared/dropdown";
import { BaseSyntheticEvent, useCallback, useContext, useState } from "react";
import { NumberInput } from "../shared/number";
import { Route as SimulationCoolingRoute } from "../../routes/simulations.$simulationId.cooling";
import { debounce } from "lodash";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { AppContext } from "../../App";
import { Input } from "../shared/input";
import { Tooltip } from "react-tooltip";

const defaultResolution = 10;
const defaultGranularity = 1.0;

export function TimeStepBar() {
  const navigate = useNavigate();
  const { timestepType, resolution, granularity } = useSearch({
    from: SimulationCoolingRoute.fullPath,
  });
  const { simulationId } = useParams({ from: SimulationCoolingRoute.fullPath });
  const [timestepValue, setTimestepValue] = useState({
    resolution,
    granularity,
  });
  const { setTheme, theme } = useContext(AppContext);

  const onChange = ({ g, r }: { g?: number; r?: number }) => {
    setTimestepValue({ granularity: g, resolution: r });

    debouncedNavigate({ g, r });
  };

  const debouncedNavigate = useCallback(
    debounce(({ g, r }: { g?: number; r?: number }) => {
      navigate({
        from: SimulationCoolingRoute.fullPath,
        params: { simulationId },
        search: (prev) => ({
          ...prev,
          granularity: g,
          resolution: r,
        }),
      });
    }, 500),
    []
  );

  return (
    <div className="px-6 flex items-center my-4">
      <span className="text-neutral-200 mr-2">Timestep Type:</span>
      <Select
        value={timestepType}
        choices={[
          { label: "Resolution", value: "resolution" },
          { label: "Granularity", value: "granularity" },
        ]}
        onChange={(e) => {
          const value = e.target.value as "resolution" | "granularity";
          const g = value === "granularity" ? defaultGranularity : undefined;
          const r = value === "resolution" ? defaultResolution : undefined;
          navigate({
            from: SimulationCoolingRoute.fullPath,
            params: { simulationId },
            search: (prev) => ({
              ...prev,
              granularity: g,
              resolution: r,
              timestepType: value,
            }),
          });
          setTimestepValue({ granularity: g, resolution: r });
        }}
      />
      <div className="ml-4">
        {timestepType === "resolution" && (
          <NumberInput
            label="Resolution:"
            labelAlignment="horizontal"
            inputProps={{
              onChange: (e: BaseSyntheticEvent) => {
                onChange({ g: undefined, r: Number(e.target.value) });
              },
              value: timestepValue.resolution,
              min: 1,
            }}
          />
        )}
        {timestepType === "granularity" && (
          <Input
            label="Granularity:"
            labelAlignment="horizontal"
            value={timestepValue.granularity}
            onChange={(e: BaseSyntheticEvent) => {
              const value = e.target.value;
              if (!value || Number(value) > 0) {
                onChange({ g: value, r: undefined });
              }
            }}
          />
        )}
      </div>
      <button
        className="ml-auto"
        onClick={(e) => {
          e.preventDefault();
          if (!theme || theme === "dark") {
            localStorage.setItem("graph-theme", "light");
            setTheme("light");
          } else {
            localStorage.setItem("graph-theme", "dark");
            setTheme("dark");
          }
        }}
        data-tooltip-id="dark-light-mode-tooltip"
        data-tooltip-content="Toggle Light/Dark Mode for Graphs"
        data-tooltip-delay-show={750}
      >
        {!theme || theme === "dark" ? (
          <MoonIcon className="h-6 w-6 text-neutral-200" />
        ) : (
          <SunIcon className="h-6 w-6 text-neutral-200" />
        )}
      </button>
      <Tooltip id="dark-light-mode-tooltip" />
    </div>
  );
}
