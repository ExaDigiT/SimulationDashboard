import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <section className="flex w-full justify-center">
      <div className="flex max-w-lg flex-col justify-center gap-16">
        <div className="flex gap-8">
          <p className="dark:text-neutral-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos cum
            officia reprehenderit voluptates deleniti, vel laudantium
            blanditiis, debitis quo numquam eveniet expedita nihil atque
            distinctio aut repudiandae, soluta culpa recusandae?
          </p>
          <span className="dark:text-neutral-200 ">image placeholder</span>
        </div>
        <div className="flex flex-row-reverse gap-8">
          <p className="dark:text-neutral-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos cum
            officia reprehenderit voluptates deleniti, vel laudantium
            blanditiis, debitis quo numquam eveniet expedita nihil atque
            distinctio aut repudiandae, soluta culpa recusandae?
          </p>
          <span className="dark:text-neutral-200 ">image placeholder</span>
        </div>
        <div className="flex gap-8">
          <p className="dark:text-neutral-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos cum
            officia reprehenderit voluptates deleniti, vel laudantium
            blanditiis, debitis quo numquam eveniet expedita nihil atque
            distinctio aut repudiandae, soluta culpa recusandae?
          </p>
          <span className="dark:text-neutral-200 ">image placeholder</span>
        </div>
      </div>
    </section>
  );
}
