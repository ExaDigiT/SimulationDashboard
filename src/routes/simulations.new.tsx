import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { RAPSForm } from "../components/simulations/raps.form";
import { BasicSettingsForm } from "../components/simulations/basicSettings.form";
import { Button } from "../components/shared/button";
import { CoolingForm } from "../components/simulations/cooling.form";
import { SimulationRequest } from "../models/SimulationRequest.model";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import axios from "../util/apis";

export const Route = createFileRoute("/simulations/new")({
  component: NewSimultation,
});

const steps: {
  stepName: string;
  Content: (props: {
    form: SimulationRequest;
    setForm: (form: SimulationRequest) => void;
  }) => JSX.Element;
}[] = [
  { stepName: "Base Settings", Content: BasicSettingsForm },
  { stepName: "RAPS Configuration", Content: RAPSForm },
  { stepName: "Cooling Configuration", Content: CoolingForm },
];

function NewSimultation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<SimulationRequest>(new SimulationRequest());
  const navigate = useNavigate();

  const CurrentForm =
    currentStep < steps.length ? steps[currentStep].Content : null;

  const onSubmit = useMutation({
    mutationFn: async ({ form }: { form: SimulationRequest }) => {
      const res = await axios.post("/frontier/simulation/run", form);
      console.log(res);
    },
  });

  const onNext = async (type: "next" | "submit") => {
    if (type === "submit") {
      await onSubmit.mutateAsync({ form });
      navigate({ to: "/simulations/" });
    } else {
      setCurrentStep((currentStep) => currentStep + 1);
    }
  };

  return (
    <div className="flex justify-center flex-col m-6 flex-1">
      <Link
        to="/simulations/"
        className="flex gap-2 items-center self-start hover:opacity-75 transition-opacity duration-500"
      >
        <ArrowLeftIcon className="h-6 w-6" />
        <span>Back to List</span>
      </Link>
      <div className="p-8 shadow-md rounded-lg mt-6 flex-1 flex flex-col">
        <div className="flex">
          {steps.map((step, index) => (
            <button
              className="flex flex-col items-center flex-1 relative"
              disabled={index > currentStep}
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep(index);
              }}
            >
              {index !== 0 && (
                <div className="absolute border-2 border-gray-500 top-4 w-full right-1/2 pointer-events-none" />
              )}
              <div
                className={`z-10 relative rounded-full border-2 w-8 h-8 flex justify-center items-center shadow-md ${index === currentStep && "bg-blue-500 text-white"} ${index !== currentStep && "bg-white"}`}
              >
                {index + 1}
              </div>
              <div
                className={`text-center ${index !== currentStep && "opacity-75"} ${index === currentStep && "opacity-100"}`}
              >
                {step.stepName}
              </div>
            </button>
          ))}
        </div>
        <div className="my-6 flex-1">
          {CurrentForm ? <CurrentForm form={form} setForm={setForm} /> : null}
        </div>
        <footer className="flex justify-between">
          <Button
            variant="outlined"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setCurrentStep((currentStep) => currentStep - 1);
            }}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            variant="filled"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              onNext(currentStep === steps.length - 1 ? "submit" : "next");
            }}
          >
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </footer>
      </div>
    </div>
  );
}
