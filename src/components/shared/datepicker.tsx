import { ChangeEvent } from "react";

export interface DatePickerProps {
  label: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export function DatePicker(props: DatePickerProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor="start-date" className="mb-2 pl-3">
        {props.label}
      </label>
      <input
        type="datetime-local"
        id="start-date"
        className="border-2 rounded-md px-2 py-2"
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}
