import {
  ArrowLeftIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import {
  Link,
  LinkProps,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { Timeline } from "../components/simulations/details/timeline";
import { addSeconds, differenceInSeconds } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";

export const Route = createFileRoute("/simulations/$simulationId")({
  component: Simulation,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      start: (search.start as string) || new Date().toISOString(),
      end: (search.end as string) || new Date().toISOString(),
      currentTimestamp: search.currentTimestamp as string,
    };
  },
});

function TabLink(props: LinkProps) {
  return (
    <Link
      className="flex flex-1 items-center justify-center border-b-2 px-4 py-4 transition-all duration-500 hover:border-b-blue-300 hover:opacity-80 dark:text-neutral-200"
      activeProps={{
        className: "border-blue-500 font-medium hover:border-b-blue-500",
      }}
      inactiveProps={{
        className: "border-neutral-400",
      }}
      {...props}
    >
      {props.children}
    </Link>
  );
}

function Simulation() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { simulationId } = Route.useParams();
  const search = Route.useSearch();
  const { data, isLoading } = useQuery(
    simulationConfigurationQueryOptions(simulationId),
  );

  const [replayStatus, setReplayStatus] = useState<"play" | "pause" | "stop">(
    "stop",
  );

  const [currentTimestamp, setCurrentTimestamp] = useState(
    search.currentTimestamp,
  );

  const [interval, setInterval] = useState(1);

  useEffect(() => {
    const currentSeconds = differenceInSeconds(currentTimestamp, search.start);
    const endSeconds = differenceInSeconds(search.end, search.start);
    if (replayStatus === "play" && currentSeconds < endSeconds) {
      const replayTimer = setTimeout(() => {
        const newTimestamp = addSeconds(currentTimestamp, 15).toISOString();
        setCurrentTimestamp(newTimestamp);
        navigate({
          search: (prev) => ({
            ...prev,
            currentTimestamp: newTimestamp,
          }),
        });
      }, 2500 / interval);
      return () => clearTimeout(replayTimer);
    }
  }, [replayStatus, currentTimestamp]);

  const onReplayUpdate = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    if (replayStatus === "pause" || replayStatus === "stop") {
      setReplayStatus("play");
    } else if (replayStatus === "play") {
      setReplayStatus("pause");
    }
  };

  const onRestart = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setCurrentTimestamp(search.start);
    navigate({
      search: (prev) => ({
        ...prev,
        currentTimestamp: search.start,
      }),
    });
  };

  const onTimelineChange = (value: number) => {
    setReplayStatus("pause");
    setCurrentTimestamp(addSeconds(search.start, value).toISOString());
    navigate({
      search: (prev) => ({
        ...prev,
        currentTimestamp: addSeconds(search.start, value).toISOString(),
      }),
    });
  };

  if (isLoading || !data) return <LoadingSpinner />;

  return (
    <div className="m-6 flex flex-1 flex-col justify-center overflow-hidden">
      <div className="flex items-center gap-12 dark:text-neutral-200">
        <Link
          to="/simulations"
          className="flex items-center gap-2 self-start transition-opacity duration-500 hover:opacity-75"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span>Back to List</span>
        </Link>
        <span className="text-medium">Simulation ID: {simulationId}</span>
      </div>
      <div className="mt-4 flex flex-1 flex-col overflow-y-hidden rounded-md bg-neutral-200 shadow-md dark:bg-neutral-800">
        <div className="flex items-center">
          <TabLink
            to="/simulations/$simulationId/summary"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Summary
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/configuration"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Configuration
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/jobs"
            params={{ simulationId: simulationId }}
            search={search}
          >
            Jobs
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/cooling"
            params={{ simulationId: simulationId }}
            search={{ ...search, resolution: 10 }}
          >
            Power
          </TabLink>
        </div>
        <Outlet />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={onRestart}>
          <ArrowPathIcon className={`h-6 w-6 text-neutral-400`} />
        </button>
        <button onClick={onReplayUpdate}>
          {replayStatus === "stop" || replayStatus === "pause" ? (
            <PlayIcon
              data-tooltip-id="play-button"
              data-tooltip-content="Play Simulation"
              className={`h-6 w-6 text-neutral-400`}
            />
          ) : (
            <PauseIcon className={`h-6 w-6 text-neutral-400`} />
          )}
        </button>
        <span className="text-nowrap text-neutral-400">
          {currentTimestamp} / {search.end}
        </span>
        <Timeline
          value={differenceInSeconds(currentTimestamp, search.start)}
          onChange={onTimelineChange}
          maxValue={differenceInSeconds(search.end, search.start)}
          startDate={search.start}
          interval={interval}
          onIntervalChange={(newInterval: number) => {
            setInterval(newInterval);
          }}
        />
        <Tooltip id="play-button" />
      </div>
    </div>
  );
}
