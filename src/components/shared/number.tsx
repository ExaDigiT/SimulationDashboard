import { HTMLProps } from "react";

export interface NumberInputProps extends HTMLProps<HTMLDivElement> {
  label: string;
  inputProps: HTMLProps<HTMLInputElement>;
}

export function NumberInput(props: NumberInputProps) {
  return (
    <div {...props} className={props.className + " flex flex-col"}>
      <label className="mb-2 pl-3">{props.label}</label>
      <input
        {...props.inputProps}
        type="number"
        className={
          props.inputProps.className + " border-2 rounded-md px-2 py-2"
        }
      />
    </div>
  );
}
