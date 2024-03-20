export function Header({ children }: { children: JSX.Element | string }) {
  return (
    <span className="font-medium text-lg border-b-2 pb-2 border-neutral-200 text-neutral-200">
      {children}
    </span>
  );
}
