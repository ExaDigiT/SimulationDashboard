import { addSeconds } from "date-fns";
import ReactSlider from "react-slider";
import { Tooltip } from "react-tooltip";
import { PlaybackRateSelector } from "./playbackRateSelector";
import { PlaybackIntervalSelector } from "./playbackIntervalSelector";

export interface TimelineProps {
  /**
   * Value in seconds
   */
  value: number;
  maxValue?: number;
  maxTimelineValue: number;
  onChange: (value: number, index: number) => void;
  startDate: string;
  interval: number;
  rate: number;
  onIntervalChange: (newValue: number) => void;
  onRateChange: (newValue: number) => void;
}

export function Timeline(props: TimelineProps) {
  return (
    <div className="flex w-full items-center gap-4">
      <ReactSlider
        orientation="horizontal"
        className="h-4 w-full"
        trackClassName="bg-neutral-200 dark:bg-neutral-700 cursor-pointer h-2 rounded-full top-1 [&.track-0]:bg-blue-500 track"
        thumbClassName="bg-blue-500 h-4 w-4 rounded-full cursor-pointer shadow-xl"
        min={0}
        max={props.maxTimelineValue}
        value={props.value || 0}
        onAfterChange={props.onChange}
        renderThumb={(thumbProps, state) => (
          <div
            {...thumbProps}
            data-tooltip-id="timeline-thumb"
            data-tooltip-content={addSeconds(
              props.startDate,
              state.value,
            ).toISOString()}
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
