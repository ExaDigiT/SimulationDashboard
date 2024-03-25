import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Header({ children }: { children: JSX.Element | string }) {
  return (
    <span className="font-medium text-lg border-b-2 pb-2 border-neutral-200 text-neutral-200">
      {children}
    </span>
  );
}

export function Section({
  header,
  defaultExpanded = true,
  children,
}: {
  header: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  return (
    <div className="mt-4">
      <button
        className="w-full border-b-2 pb-2 border-neutral-200 text-neutral-200 group flex items-center justify-between"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen((isOpen) => !isOpen);
        }}
      >
        <span className="font-medium text-lg">{header}</span>
        <ArrowDownIcon
          className={`h-5 w-5 transition-transform transform duration-500 ${!isOpen && "rotate-180"}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="grid grid-cols-2 items-center gap-y-4 mt-2 overflow-hidden"
          >
            {children}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
