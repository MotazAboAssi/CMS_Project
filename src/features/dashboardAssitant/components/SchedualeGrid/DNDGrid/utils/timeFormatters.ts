import { START_TIME_MINUTES } from "../../../../data/scheduleGrid";

const formatTime = (totalMins: number): string => {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  const displayH = h === 0 || h === 12 ? 12 : h % 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${displayH}:${m === 0 ? "00" : m < 10 ? `0${m}` : m} ${ampm}`;
};

export const formatMinutesToTime = (
  minutesSinceStart: number,
  duration: number
): string => {
  const totalStart = START_TIME_MINUTES + minutesSinceStart;
  return `${formatTime(totalStart)} - ${formatTime(totalStart + duration)}`;
};

export const formatDisplayTimeRange = (
  startMins: number,
  endMins: number
): string => {
  return `${formatTime(START_TIME_MINUTES + startMins)} - ${formatTime(START_TIME_MINUTES + endMins)}`;
};