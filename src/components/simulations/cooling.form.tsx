import { ChangeEvent } from "react";
import { SimulationRequest } from "../../models/SimulationRequest.model";
import { Checkbox } from "../shared/checkbox";

export function CoolingForm(props: {
  form: SimulationRequest;
  setForm: (form: SimulationRequest) => void;
}) {
  return (
    <>
      <Checkbox
        label="Enabled"
        checked={props.form.cooling.enabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.setForm({
            ...props.form,
            cooling: { ...props.form.cooling, enabled: e.target.checked },
          });
        }}
      />
    </>
  );
}
