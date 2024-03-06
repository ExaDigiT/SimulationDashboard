import { SimulationRequest } from "../../models/SimulationRequest.model";
import { SharedDatePicker } from "../shared/datepicker";

export function BasicSettingsForm({
  form,
  setForm,
}: {
  form: SimulationRequest;
  setForm: (form: SimulationRequest) => void;
}) {
  return (
    <form className="grid grid-cols-3 gap-3">
      <SharedDatePicker
        label="Start Date"
        onChange={(newDate) => {
          setForm({ ...form, start: newDate || "" });
        }}
        value={form.start}
        boundedDate={new Date()}
      />
      <SharedDatePicker
        label="End Date"
        onChange={(newDate) => {
          setForm({ ...form, end: newDate || "" });
        }}
        value={form.end}
        boundedDate={new Date()}
      />
    </form>
  );
}
