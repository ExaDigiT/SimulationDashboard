import { ChangeEvent, HTMLProps } from "react";

export interface SelectProps extends HTMLProps<HTMLSelectElement> {
  choices: { label: string; value: string }[];
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function Select(props: SelectProps) {
  return (
    <div className="flex flex-col">
      {props.label && (
        <label className="mb-2 pl-3 text-neutral-200">{props.label}</label>
      )}
      <select
        {...props}
        onChange={props.onChange}
        value={props.value}
        className={
          props.className +
          " px-2 py-2 text-neutral-200 focus:outline-none bg-transparent border-b-2 focus:border-blue-500 transition-colors duration-300 ease-in-out hover:border-blue-500 cursor-pointer"
        }
      >
        <option disabled value="">
          {props.placeholder}
        </option>
        {props.choices.map((choice) => (
          <option
            key={choice.value}
            value={choice.value}
            className="text-black placeholder:text-neutral-500"
          >
            {choice.label}
          </option>
        ))}
      </select>
    </div>
  );
}
