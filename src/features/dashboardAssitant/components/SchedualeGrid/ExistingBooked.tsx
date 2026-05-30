import { cn } from "@/lib/utils";
import  { ROW_MINUTES, SLOT_HEIGHT, START_TIME_MINUTES } from "../../data/scheduleGrid";
import type { ColumnAppointmentsType } from "../../types";

export function ExistingBooked({
  columnAppointments,
}: {
  columnAppointments: ColumnAppointmentsType[];
}): React.ReactNode {
  return columnAppointments.map((apt) => {
    const topOffset = (apt.start / ROW_MINUTES) * SLOT_HEIGHT;
    const cardHeight = ((apt.end - apt.start) / ROW_MINUTES) * SLOT_HEIGHT;

    const startH = Math.floor((START_TIME_MINUTES + apt.start) / 60) % 24;
    const startM = (START_TIME_MINUTES + apt.start) % 60;
    const endH = Math.floor((START_TIME_MINUTES + apt.end) / 60) % 24;
    const endM = (START_TIME_MINUTES + apt.end) % 60;

    const formatTimeLabel = (h: number, m: number) => {
      const displayH = h === 0 || h === 12 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      return `${displayH}:${m === 0 ? "00" : m < 10 ? "0" + m : m} ${ampm}`;
    };

    return (
      <div
        key={apt.id}
        style={{
          top: topOffset + 3,
          height: cardHeight - 6,
        }}
        className={cn(
          "absolute left-2 right-2 rounded-xl p-3 flex flex-col justify-between text-xs transition-all shadow-xs group cursor-pointer z-10 backdrop-blur-xs",
          apt.status === "confirmed" &&
            "bg-[#E2F1FF] border border-blue-200/80 text-[#0055cc]",
          apt.status === "urgent" &&
            "bg-red-50 border border-red-200/80 text-red-700",
          apt.status === "in_progress" &&
            "bg-purple-50 border border-purple-200/80 text-purple-700",
          apt.status === "late" &&
            "bg-amber-50 border border-amber-200/80 text-amber-700",
          apt.status === "unavailable" &&
            "bg-neutral-50 border border-neutral-200 text-neutral-400 line-through opacity-75",
        )}
      >
        <div className="flex items-start gap-1.5 min-w-0">
          {apt.status === "urgent" && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
          )}
          <span className="font-bold tracking-tight truncate leading-tight">
            {apt.title}
          </span>
        </div>
        <span className="text-[10px] font-bold opacity-75 font-mono tracking-tight">
          {`${formatTimeLabel(startH, startM)} - ${formatTimeLabel(endH, endM)}`}
        </span>
      </div>
    );
  });
}