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
import { addSeconds, differenceInSeconds, isEqual } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import {
  useReplayCooling,
  useReplayJobs,
  useReplayScheduler,
} from "../util/hooks/useReplay";

export const Route = createFileRoute("/simulations/$simulationId")({
  component: Simulation,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      start: (search.start as string) || new Date().toISOString(),
      end: (search.end as string) || new Date().toISOString(),
      currentTimestamp: search.currentTimestamp as string,
      playbackInterval: (search.playbackInterval as number) || 15,
      initialTimestamp: search.initialTimestamp as string,
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
  const maxTimestamp =
    (data?.progress ?? 0) * differenceInSeconds(search.end, search.start);

  const [replayStatus, setReplayStatus] = useState<"play" | "pause" | "stop">(
    "stop",
  );

  const [currentTimestamp, setCurrentTimestamp] = useState(
    search.currentTimestamp,
  );
  const [initialTimestamp, setInitialTimestamp] = useState(
    search.initialTimestamp,
  );
  const [playbackInterval, setPlaybackInterval] = useState(
    search.playbackInterval,
  );

  const [rate, setRate] = useState(20);

  const {
    fetchNextPage: fetchNextCoolingPage,
    data: coolingData,
    isFetchingNextPage: isFetchingNextCoolingPage,
    hasNextPage: hasNextCoolingPage,
  } = useReplayCooling({
    end: search.end,
    start: search.start,
    simulationId,
    currentTimestamp,
    initialTimestamp,
    playbackInterval,
  });

  const {
    fetchNextPage: fetchNextSchedulerPage,
    isFetchingNextPage: isFetchingNextSchedulerPage,
    hasNextPage: hasNextSchedulerPage,
  } = useReplayScheduler({
    end: search.end,
    start: search.start,
    simulationId,
    currentTimestamp,
    initialTimestamp,
    playbackInterval,
  });

  const {
    fetchNextPage: fetchNextJobPage,
    isFetchingNextPage: isFetchingNextJobPage,
    hasNextPage: hasNextJobPage,
  } = useReplayJobs({
    end: search.end,
    start: search.start,
    simulationId,
    initialTimestamp,
    playbackInterval,
  });

  useEffect(() => {
    const currentSeconds = differenceInSeconds(currentTimestamp, search.start);
    const endSeconds = differenceInSeconds(search.end, search.start);
    if (replayStatus === "play" && currentSeconds < endSeconds) {
      const replayTimer = setTimeout(() => {
        const newTimestamp = addSeconds(
          currentTimestamp,
          playbackInterval,
        ).toISOString();

        const lastPage = coolingData?.pageParams[
          coolingData.pageParams.length - 1
        ] as number;
        const startCurrentDifference = differenceInSeconds(
          currentTimestamp,
          search.start,
        );
        const currentLastPageSeconds = playbackInterval * 20 + lastPage;
        if (
          startCurrentDifference >=
          currentLastPageSeconds - playbackInterval * 10
        ) {
          if (!isFetchingNextCoolingPage && hasNextCoolingPage) {
            fetchNextCoolingPage();
          }

          if (!isFetchingNextSchedulerPage && hasNextSchedulerPage) {
            fetchNextSchedulerPage();
          }

          if (!isFetchingNextJobPage && hasNextJobPage) {
            fetchNextJobPage();
          }
        }

        setCurrentTimestamp(newTimestamp);
        navigate({
          search: (prev) => ({
            ...prev,
            currentTimestamp: newTimestamp,
          }),
        });

        if (
          isEqual(newTimestamp, search.end) ||
          isEqual(newTimestamp, addSeconds(search.start, maxTimestamp))
        ) {
          setReplayStatus("stop");
        }
      }, 15000 / rate);
      return () => clearTimeout(replayTimer);
    }
  }, [replayStatus, currentTimestamp, rate, playbackInterval]);

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
    setInitialTimestamp(search.start);
    navigate({
      search: (prev) => ({
        ...prev,
        currentTimestamp: search.start,
        initialTimestamp: search.start,
      }),
    });
    setReplayStatus("play");
  };

  const onTimelineChange = (value: number) => {
    setReplayStatus("pause");
    if (data && value <= maxTimestamp) {
      const leftOver = value % playbackInterval;
      let snappedValue = value;
      if (leftOver > playbackInterval / 2) {
        snappedValue = value + (playbackInterval - leftOver);
      } else {
        snappedValue = value - leftOver;
      }
      const newTimestamp =
        addSeconds(search.start, snappedValue).toISOString().split(".")[0] +
        "Z";

      setCurrentTimestamp(newTimestamp);
      setInitialTimestamp(newTimestamp);
      navigate({
        search: (prev) => ({
          ...prev,
          currentTimestamp: newTimestamp,
          initialTimestamp: newTimestamp,
        }),
      });
    }
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
            search={{ ...search, granularity: 900 }}
          >
            Plots
          </TabLink>
          <TabLink
            to="/simulations/$simulationId/console"
            params={{ simulationId: simulationId }}
            search={{ ...search }}
          >
            Console
          </TabLink>
        </div>
        <Outlet />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onRestart}
          disabled={differenceInSeconds(currentTimestamp, search.start) === 0}
        >
          <ArrowPathIcon
            className={`h-6 w-6 text-neutral-400`}
            data-tooltip-id="restart-button"
            data-tooltip-content="Restart Simulation"
            data-tooltip-delay-show={750}
          />
        </button>
        <button
          onClick={onReplayUpdate}
          disabled={
            (replayStatus === "pause" || replayStatus === "stop") &&
            maxTimestamp === 0
          }
        >
          {replayStatus === "stop" || replayStatus === "pause" ? (
            <PlayIcon
              data-tooltip-id="play-button"
              data-tooltip-content="Play Simulation"
              data-tooltip-delay-show={750}
              className={`h-6 w-6 text-neutral-400`}
            />
          ) : (
            <PauseIcon className={`h-6 w-6 text-neutral-400`} />
          )}
        </button>
        <span
          className="w-36 text-nowrap text-right text-neutral-400"
          data-tooltip-id="current-timestamp"
          data-tooltip-content={`${currentTimestamp} / ${search.end}`}
          data-tooltip-delay-show={750}
        >
          {differenceInSeconds(currentTimestamp, search.start)} /{" "}
          {differenceInSeconds(search.end, search.start)}
        </span>
        <Timeline
          value={differenceInSeconds(currentTimestamp, search.start)}
          onChange={onTimelineChange}
          maxValue={maxTimestamp}
          maxTimelineValue={differenceInSeconds(search.end, search.start)}
          startDate={search.start}
          interval={search.playbackInterval}
          onIntervalChange={(newInterval: number) => {
            setPlaybackInterval(newInterval);
            navigate({
              search: (prev) => ({
                ...prev,
                playbackInterval: newInterval,
              }),
            });
          }}
          onRateChange={(newRate: number) => {
            setRate(newRate);
          }}
          rate={rate}
        />
        <Tooltip id="play-button" />
        <Tooltip id="restart-button" />
        <Tooltip id="current-timestamp" />
      </div>
    </div>
  );
}
