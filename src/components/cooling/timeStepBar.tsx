import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Select } from "../shared/dropdown";
import { BaseSyntheticEvent, useCallback, useState } from "react";
import { NumberInput } from "../shared/number";
import { Route as SimulationCoolingRoute } from "../../routes/simulations.$simulationId.cooling";
import { debounce } from "lodash";
import { Input } from "../shared/input";

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
    [],
  );

  return (
    <div className="my-4 flex items-center px-6">
      <span className="mr-2 dark:text-neutral-200">Timestep Type:</span>
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
    </div>
  );
}
