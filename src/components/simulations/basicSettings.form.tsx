import { addMinutes } from "date-fns";
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
    <>
      <SharedDatePicker
        label="Start Date"
        onChange={(newDate) => {
          if (newDate) {
            const endDate = addMinutes(newDate, 60).toISOString();
            setForm({ ...form, start: newDate, end: endDate });
          }
        }}
        value={form.start}
      />
      <SharedDatePicker
        key={form.end}
        label="End Date"
        onChange={(newDate) => {
          setForm({ ...form, end: newDate || "" });
        }}
        value={form.end}
        boundedDate={new Date(form.start)}
      />
    </>
  );
}
