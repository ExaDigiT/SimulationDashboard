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
        className={props.className + " border-2 rounded-md px-2 py-2"}
      >
        <option disabled value="">
          {props.placeholder}
        </option>
        {props.choices.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </select>
    </div>
  );
}
