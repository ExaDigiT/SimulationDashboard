import { HTMLProps } from "react";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
}

export function Input(props: InputProps) {
  return (
    <div className="flex flex-col">
      {props.label && (
        <label htmlFor="text-input" className="mb-2 pl-3">
          {props.label}
        </label>
      )}
      <input
        {...props}
        id="text-input"
        type="text"
        className="border-2 rounded-md px-2 py-2 "
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}
