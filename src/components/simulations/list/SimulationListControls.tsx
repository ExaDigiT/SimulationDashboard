import { Link } from "@tanstack/react-router";

export function SimulationListControls() {
  return (
    <div className="h-16 flex">
      <div className="flex-1">Place Holder for Timeline Graph</div>
      <Link
        to="/simulations/new"
        className="bg-green-600 text-white px-3 text-center flex items-center transition-opacity duration-500 hover:opacity-80"
      >
        New Simulation
      </Link>
    </div>
  );
}
