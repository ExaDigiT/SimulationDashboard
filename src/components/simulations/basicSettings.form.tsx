import { SimulationRequest } from "../../models/SimulationRequest.model";
import { DatePicker } from "../shared/datepicker";

export function BasicSettingsForm({
  form,
  setForm,
}: {
  form: SimulationRequest;
  setForm: (form: SimulationRequest) => void;
}) {
  return (
    <form className="flex gap-4">
      <DatePicker
        label="Start Date"
        onChange={(e) => {
          setForm({ ...form, start: e.target.value });
        }}
        value={form.start}
      />
      <DatePicker
        label="End Date"
        onChange={(e) => {
          setForm({ ...form, end: e.target.value });
        }}
        value={form.end}
      />
    </form>
  );
}
