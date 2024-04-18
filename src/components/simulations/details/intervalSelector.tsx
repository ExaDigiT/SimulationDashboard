import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

const intervals = [1, 2, 5, 10, 20, 50, 100, 1000];

export function IntervalSelector(props: {
  value: number;
  onChange: (newValue: number) => void;
}) {
  return (
    <Listbox value={props.value} onChange={props.onChange}>
      <div className="relative">
        <Listbox.Button
          className={`w-[60px] rounded-md py-1 dark:text-neutral-200 dark:hover:bg-neutral-600`}
        >
          {props.value}x
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className={
              "absolute bottom-full right-0 z-10 mb-1 flex flex-col gap-1 rounded-md py-2 text-center dark:bg-neutral-700"
            }
          >
            {intervals.reverse().map((interval) => (
              <Listbox.Option
                key={interval}
                value={interval}
                className={({ selected }) =>
                  `cursor-pointer px-4 transition-colors duration-300 ease-in-out ${selected ? "text-blue-500" : "text-neutral-200 dark:hover:bg-neutral-600"}`
                }
              >
                {interval}x
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
