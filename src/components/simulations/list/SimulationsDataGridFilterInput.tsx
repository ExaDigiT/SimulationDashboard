import { ChangeEvent } from "react";
import { SharedDatePicker } from "../../shared/datepicker";
import { Select } from "../../shared/dropdown";
import { Input } from "../../shared/input";

export function SimulationDataGridFilterInput(
  props:
    | {
        fieldType: "text";
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
      }
    | {
        fieldType: "select";
        value: string;
        choices: { label: string; value: string }[];
        onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
      }
    | {
        fieldType: "datetime";
        value: string;
        onChange: (date: string | null) => void;
      }
) {
  switch (props.fieldType) {
    case "text":
      return (
        <Input
          placeholder="Filter Value"
          value={props.value}
          onChange={props.onChange}
        />
      );
    case "select":
      return (
        <Select
          value={props.value}
          choices={props.choices}
          onChange={props.onChange}
          placeholder="Filter Value"
        />
      );
    case "datetime":
      return (
        <SharedDatePicker
          value={props.value || new Date().toISOString()}
          onChange={props.onChange}
        />
      );
    default:
      return null;
  }
}
