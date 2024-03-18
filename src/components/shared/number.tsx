import { HTMLProps } from "react";

export interface NumberInputProps extends HTMLProps<HTMLDivElement> {
  label: string;
  inputProps: HTMLProps<HTMLInputElement>;
  error?: { error: boolean; errorText: string };
}

export function NumberInput(props: NumberInputProps) {
  return (
    <div className={props.className + " flex flex-col"}>
      <label className="mb-2 pl-3 text-neutral-200">{props.label}</label>
      <input
        {...props.inputProps}
        type="number"
        className={
          props.inputProps.className +
          " border-2 rounded-md px-2 py-2 " +
          `${props.error?.error && "border-red-600"}`
        }
      />
      {props.error?.error && (
        <span className="text-red-600">{props.error.errorText}</span>
      )}
    </div>
  );
}
