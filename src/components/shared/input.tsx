import { HTMLProps } from "react";

export interface InputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  labelAlignment?: "vertical" | "horizontal";
}

export function Input(props: InputProps) {
  return (
    <div
      className={`${props.labelAlignment === "horizontal" ? "flex flex-row items-center" : "flex flex-col"} gap-2`}
    >
      {props.label && (
        <label htmlFor="text-input" className="pl-3 text-neutral-200">
          {props.label}
        </label>
      )}
      <input
        {...props}
        id="text-input"
        type="text"
        className="border-b-2 px-2 py-2 focus:outline-none text-neutral-200 bg-transparent transition-colors duration-300 hover:border-blue-500 focus:border-blue-500"
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}
