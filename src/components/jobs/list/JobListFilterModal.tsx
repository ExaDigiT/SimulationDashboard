import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { Modal } from "../../shared/modal";
import { useState } from "react";

export function JobListFilterModal() {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-500 rounded-full px-2 py-2 dark:text-neutral-200"
        data-tooltip-id="filter-tooltip"
        data-tooltip-content={"Open Filter Dialog"}
        data-tooltip-delay-show={500}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        <AdjustmentsHorizontalIcon className="h-6 w-6" />
      </button>
      <Tooltip id="filter-tooltip" />
      <Modal open={isOpen}>
        <header className="flex items-center justify-between px-4 py-2 border-b-2">
          <span className="text-lg font-medium">Job List Filter Options</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="transition-opacity duration-500 hover:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        <section>
          <h1>W.I.P.</h1>
        </section>
      </Modal>
    </>
  );
}
