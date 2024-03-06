import { useState } from "react";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";

export interface DatePickerProps {
  label?: string;
  onChange: (value: string | null) => void;
  value: string;
}

export function SharedDatePicker(props: DatePickerProps) {
  const [date, setDate] = useState(props.value ? parseISO(props.value) : null);

  return (
    <div className="flex flex-col w-full">
      {props.label && (
        <label htmlFor="start-date" className="mb-2 pl-3 text-neutral-200">
          {props.label}
        </label>
      )}
      <DatePicker
        selected={date}
        onChange={(newDate, e) => {
          e?.preventDefault();
          setDate(newDate);
          props.onChange(newDate?.toISOString() || null);
        }}
        showTimeSelect
        className="border-2 rounded-md px-2 py-2 w-full"
        minDate={new Date()}
        dateFormat="MM/dd/yyyy, HH:mm z"
      />
    </div>
  );
}
