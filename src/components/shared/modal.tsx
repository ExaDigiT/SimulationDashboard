export function Modal({
  open,
  children,
}: {
  open: boolean;
  children: JSX.Element | JSX.Element[];
}) {
  if (!open) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="bg-neutral-800 opacity-50 w-full h-full absolute" />
      <div className="absolute bg-neutral-700 text-neutral-200 border-neutral-200 w-2/3 h-2/3 rounded-md flex flex-col">
        {children}
      </div>
    </div>
  );
}
