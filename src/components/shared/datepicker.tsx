import { useState } from "react";
import DatePicker from "react-datepicker";
import { parseISO } from "date-fns";
import { CalendarIcon } from "@heroicons/react/24/outline";

export interface DatePickerProps {
  label?: string;
  onChange: (value: string | null) => void;
  value: string;
  boundedDate?: Date;
}

export function SharedDatePicker(props: DatePickerProps) {
  const [date, setDate] = useState(props.value ? parseISO(props.value) : null);

  return (
    <div className="flex flex-col w-full">
      {props.label && (
        <label htmlFor="start-date" className="mb-2 pl-3 dark:text-neutral-200">
          {props.label}
        </label>
      )}
      <DatePicker
        showIcon
        selected={date}
        onChange={(newDate, e) => {
          e?.preventDefault();
          setDate(newDate);
          props.onChange(newDate?.toISOString() || null);
        }}
        toggleCalendarOnIconClick
        showTimeSelect
        className="border-b-2 border-neutral-400 !px-2 !pr-9 !py-2 w-full focus:outline-none dark:text-neutral-200 bg-transparent transition-colors duration-300 hover:border-blue-500 focus:border-blue-500"
        minDate={props.boundedDate}
        dateFormat="MM/dd/yyyy, HH:mm z"
        icon={
          <CalendarIcon className="dark:text-neutral-200 h-5 w-5 right-0 cursor-pointer transition-colors duration-500 hover:text-blue-500" />
        }
      />
    </div>
  );
}
