import { ChangeEvent } from "react";
import { JobsMode, Scheduler } from "../../models/Scheduler.model";
import { SimulationRequest } from "../../models/SimulationRequest.model";
import { Checkbox } from "../shared/checkbox";
import { Select } from "../shared/dropdown";
import { NumberInput } from "../shared/number";

export function RAPSForm(props: {
  form: SimulationRequest;
  setForm: (form: SimulationRequest) => void;
}) {
  return (
    <>
      <Checkbox
        label="Enabled"
        checked={props.form.scheduler.enabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.setForm({
            ...props.form,
            scheduler: { ...props.form.scheduler, enabled: e.target.checked },
          });
        }}
        disabled
      />
      <Select
        label="Job Mode"
        choices={[
          //{ label: "Custom", value: "custom" },
          { label: "Replay", value: "replay" },
          { label: "Random", value: "random" },
        ]}
        value={props.form.scheduler.jobs_mode}
        onChange={(e) => {
          props.setForm({
            ...props.form,
            scheduler: {
              ...props.form.scheduler,
              jobs_mode: e.target.value as JobsMode,
              seed: 0,
              num_jobs: 1000,
            },
          });
        }}
      />
      {props.form.scheduler.jobs_mode === "random" && (
        <>
          <NumberInput
            inputProps={{
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const value = parseInt(e.target.value);
                if (typeof value === "number") {
                  props.setForm({
                    ...props.form,
                    scheduler: { ...props.form.scheduler, num_jobs: value },
                  });
                }
              },
              value: props.form.scheduler.num_jobs || 0,
            }}
            label="Number of Jobs"
            className="row-start-2"
            error={{ error: false, errorText: "Field is Required" }}
          />
          <NumberInput
            label="Seed"
            inputProps={{
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                const value = parseInt(e.target.value);
                if (typeof value === "number") {
                  props.setForm({
                    ...props.form,
                    scheduler: { ...props.form.scheduler, seed: value },
                  });
                }
              },
              value: props.form.scheduler.seed || 0,
            }}
            className="row-start-2"
            error={{ error: false, errorText: "Field is Required" }}
          />
        </>
      )}
      <Select
        label="Schedule Policy"
        choices={[
          //{ label: "Custom", value: "custom" },
          { label: "fcfs", value: "fcfs" },
          { label: "sjf", value: "sjf" },
          { label: "prq", value: "prq" },
        ]}
        value={props.form.scheduler.schedule_policy}
        onChange={(e) => {
          props.setForm({
            ...props.form,
            scheduler: {
              ...props.form.scheduler,
              schedule_policy: e.target.value as Scheduler['schedule_policy'],
            }
          });
        }}
      />
      <Checkbox
        label="Reschedule"
        checked={props.form.scheduler.reschedule}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          props.setForm({
            ...props.form,
            scheduler: {
              ...props.form.scheduler,
              reschedule: e.target.checked,
            },
          });
        }}
      />
    </>
  );
}
