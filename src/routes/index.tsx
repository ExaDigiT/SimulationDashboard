import { createFileRoute } from "@tanstack/react-router";
import mainLogo from "../assets/logo.png";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-4 dark:text-neutral-200">
      <h1>Welcome to the RAPS dashboard!</h1>
      <h3>
        From here you can run simulations, look at past simulations, and dig
        into the details about simulation runs.
      </h3>
      <img
        src={mainLogo}
        className="absolute bottom-6 h-auto max-w-80 dark:invert"
      />
    </div>
  );
}
