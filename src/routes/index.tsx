import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-neutral-200 gap-4">
      <h1>Welcome to the RAPS dashboard!</h1>
      <h3>
        From here you can run simulations, look at past simulations, and dig
        into the details about simulation runs.
      </h3>
    </div>
  );
}
