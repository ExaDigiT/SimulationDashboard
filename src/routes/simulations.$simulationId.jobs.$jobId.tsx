import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Modal } from "../components/shared/modal";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const Route = createFileRoute("/simulations/$simulationId/jobs/$jobId")({
  component: JobModal,
});

function JobModal() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { jobId, simulationId } = Route.useParams();

  return (
    <Modal open={!!jobId}>
      <header className="flex items-center justify-between border-b-2 px-4 py-2">
        <span className="text-lg font-medium">Job Details</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate({
              to: "/simulations/$simulationId/jobs",
              params: { simulationId: simulationId },
              search: (prev) => ({ ...prev }),
            });
          }}
          className="transition-opacity duration-500 hover:opacity-50"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </header>
      <section>Nodes</section>
    </Modal>
  );
}
