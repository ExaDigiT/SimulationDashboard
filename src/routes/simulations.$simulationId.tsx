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
import { addSeconds, differenceInSeconds, isBefore, isEqual } from "date-fns";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { simulationConfigurationQueryOptions } from "../util/queryOptions";
import { LoadingSpinner } from "../components/shared/loadingSpinner";
import { CoolingCDU } from "../models/CoolingCDU.model";
import axios from "../util/apis";
import { SimulationStatistic } from "../models/SimulationStatistic.model";

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

  const [rate, setRate] = useState(1);

  const getNextPageParam = (
    _lastPage: unknown,
    _allPages: unknown[],
    lastPageParam: number,
  ): null | number => {
    const currentEndTime = addSeconds(
      search.start,
      playbackInterval * 20 + lastPageParam,
    );
    if (isBefore(currentEndTime, search.end)) {
      return lastPageParam + playbackInterval * 20;
    }
    return null;
  };

  const {
    fetchNextPage: fetchNextCoolingPage,
    data: coolingData,
    isFetchingNextPage: isFetchingNextCoolingPage,
    hasNextPage: hasNextCoolingPage,
  } = useInfiniteQuery({
    queryKey: [
      "simulation",
      simulationId,
      "cooling",
      playbackInterval,
      initialTimestamp,
    ],
    initialPageParam: differenceInSeconds(initialTimestamp, search.start),
    getNextPageParam: getNextPageParam,
    queryFn: async ({ pageParam }) => {
      const startTime = addSeconds(search.start, pageParam);
      const currentEndTime = addSeconds(
        search.start,
        playbackInterval * 20 + pageParam,
      );
      const isEnd = differenceInSeconds(currentTimestamp, search.end) === 0;
      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        data: CoolingCDU[];
      }>(`/frontier/simulation/${simulationId}/cooling/cdu`, {
        params: {
          start: isBefore(startTime, search.end) ? startTime : undefined,
          end: isBefore(currentEndTime, search.end)
            ? currentEndTime
            : search.end,
          granularity: isEnd ? undefined : playbackInterval,
          resolution: isEnd ? 1 : undefined,
        },
      });

      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const {
    fetchNextPage: fetchNextSchedulerPage,
    isFetchingNextPage: isFetchingNextSchedulerPage,
    hasNextPage: hasNextSchedulerPage,
  } = useInfiniteQuery({
    queryKey: [
      "simulation",
      simulationId,
      "scheduler",
      playbackInterval,
      initialTimestamp,
    ],
    initialPageParam: differenceInSeconds(initialTimestamp, search.start),
    getNextPageParam: getNextPageParam,
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam }) => {
      const startTime = addSeconds(search.start, pageParam);
      const currentEndTime = addSeconds(
        search.start,
        playbackInterval * 20 + pageParam,
      );
      const isEnd = differenceInSeconds(currentTimestamp, search.end) === 0;
      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        data: SimulationStatistic[];
      }>(`/frontier/simulation/${simulationId}/scheduler/system`, {
        params: {
          start: isBefore(startTime, search.end) ? startTime : undefined,
          end: isBefore(currentEndTime, search.end)
            ? currentEndTime
            : search.end,
          granularity: isEnd ? undefined : playbackInterval,
          resolution: isEnd ? 1 : undefined,
        },
      });

      return res.data;
    },
  });

  const {
    fetchNextPage: fetchNextJobPage,
    isFetchingNextPage: isFetchingNextJobPage,
    hasNextPage: hasNextJobPage,
  } = useInfiniteQuery({
    queryKey: [
      "simulation",
      simulationId,
      "jobs",
      playbackInterval,
      initialTimestamp,
    ],
    getNextPageParam: getNextPageParam,
    initialPageParam: differenceInSeconds(initialTimestamp, search.start),
    queryFn: async ({ pageParam }) => {
      const startTime = addSeconds(search.start, pageParam);
      const currentEndTime = addSeconds(
        search.start,
        playbackInterval * 20 + pageParam,
      );
      const res = await axios.get<{
        granularity: number;
        start: string;
        end: string;
        data: SimulationStatistic[];
      }>(`/frontier/simulation/${simulationId}/scheduler/jobs`, {
        params: {
          start: isBefore(startTime, search.end) ? startTime : undefined,
          end: isBefore(currentEndTime, search.end)
            ? currentEndTime
            : search.end,
          ...[
            "fields=job_id",
            "fields=name",
            "fields=node_count",
            "fields=state_current",
            "fields=time_limit",
            "fields=time_start",
            "fields=time_end",
            "fields=time_submission",
          ],
        },
      });

      return res.data;
    },
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
            currentLastPageSeconds - playbackInterval * 10 &&
          !isFetchingNextCoolingPage &&
          hasNextCoolingPage
        ) {
          fetchNextCoolingPage();
        }

        if (
          startCurrentDifference >=
            currentLastPageSeconds - playbackInterval * 10 &&
          !isFetchingNextSchedulerPage &&
          hasNextSchedulerPage
        ) {
          fetchNextSchedulerPage();
        }

        if (
          startCurrentDifference >=
            currentLastPageSeconds - playbackInterval * 10 &&
          !isFetchingNextJobPage &&
          hasNextJobPage
        ) {
          fetchNextJobPage();
        }

        setCurrentTimestamp(newTimestamp);
        navigate({
          search: (prev) => ({
            ...prev,
            currentTimestamp: newTimestamp,
          }),
        });

        if (isEqual(newTimestamp, search.end)) {
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
  };

  const onTimelineChange = (value: number) => {
    setReplayStatus("pause");

    const leftOver = value % playbackInterval;
    let snappedValue = value;
    if (leftOver > playbackInterval / 2) {
      snappedValue = value + (playbackInterval - leftOver);
    } else {
      snappedValue = value - leftOver;
    }
    const newTimestamp = addSeconds(search.start, snappedValue).toISOString();

    setCurrentTimestamp(newTimestamp);
    setInitialTimestamp(newTimestamp);
    navigate({
      search: (prev) => ({
        ...prev,
        currentTimestamp: newTimestamp,
        initialTimestamp: newTimestamp,
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
        <button onClick={onReplayUpdate}>
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
          className="text-nowrap text-neutral-400"
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
          maxValue={differenceInSeconds(search.end, search.start)}
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
