import { addSeconds, differenceInSeconds } from "date-fns";
import ReactSlider from "react-slider";
import { Tooltip } from "react-tooltip";
import { PlaybackRateSelector } from "./playbackRateSelector";
import { PlaybackIntervalSelector } from "./playbackIntervalSelector";
import { DateLike, formatDate } from "../../../util/datetime";

export interface TimelineProps {
  value: DateLike;
  start: DateLike;
  end: DateLike;
  onChange: (value: Date) => void;
  interval: number;
  rate: number;
  onIntervalChange: (newValue: number) => void;
  onRateChange: (newValue: number) => void;
}

export function Timeline(props: TimelineProps) {
  let max = differenceInSeconds(props.end, props.start)
  if (max % props.interval == 0) {
    max = max - props.interval
  } else {
    max = max - (max % props.interval)
  }

  return (
    <div className="flex w-full items-center gap-4">
      <ReactSlider
        orientation="horizontal"
        className="h-4 w-full"
        trackClassName="bg-neutral-200 dark:bg-neutral-700 cursor-pointer h-2 rounded-full top-1 [&.track-0]:bg-blue-500 track"
        thumbClassName="bg-blue-500 h-4 w-4 rounded-full cursor-pointer shadow-xl"
        min={0}
        max={max}
        step={props.interval}
        value={differenceInSeconds(props.value, props.start)}
        onAfterChange={(value) => {
          props.onChange(addSeconds(props.start, value))
        }}
        renderThumb={(thumbProps, state) => (
          <div
            {...thumbProps}
            data-tooltip-id="timeline-thumb"
            data-tooltip-content={`${formatDate(addSeconds(props.start, state.value))} / ${formatDate(props.end)}`}
          />
        )}
      />
      <PlaybackRateSelector value={props.rate} onChange={props.onRateChange} />
      <PlaybackIntervalSelector
        value={props.interval}
        onChange={props.onIntervalChange}
      />
      <Tooltip id="timeline-thumb" />
    </div>
  );
}
