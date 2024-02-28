import { HTMLProps } from "react";

export interface CheckboxProps extends HTMLProps<HTMLInputElement> {
  label: string;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <div className="flex flex-col items-center">
      <label htmlFor={props.label} className="mb-2">
        {props.label}
      </label>
      <input type="checkbox" id={props.label} className="py-2" {...props} />
    </div>
  );
}
