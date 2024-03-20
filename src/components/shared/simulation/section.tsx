import { ReactNode } from "react";

export function Section({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 items-center gap-y-4">{children}</div>
  );
}
