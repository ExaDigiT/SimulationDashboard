import { HTMLProps } from "react";

export interface NumberInputProps extends HTMLProps<HTMLDivElement> {
  label?: string;
  inputProps: HTMLProps<HTMLInputElement>;
  error?: { error: boolean; errorText: string };
  labelAlignment?: "vertical" | "horizontal";
}

export function NumberInput(props: NumberInputProps) {
  return (
    <div
      className={
        props.className +
        ` ${props.labelAlignment === "horizontal" ? "flex items-center flex-row gap-2" : "flex flex-col"} h-10`
      }
    >
      {props.label && (
        <label className="pl-3 text-neutral-200">{props.label}</label>
      )}
      <input
        {...props.inputProps}
        type="number"
        className={
          props.inputProps.className +
          " border-b-2 px-2 h-10 bg-transparent focus:outline-none hover:border-blue-500 focus:border-blue-500 text-neutral-200 transition-all duration-300 ease-in-out " +
          `${props.error?.error && "border-red-600"}`
        }
      />
      {props.error?.error && (
        <span className="text-red-600">{props.error.errorText}</span>
      )}
    </div>
  );
}
