import { Plus } from "lucide-react";
import { TOTAL_SLOTS, ROW_MINUTES, SLOT_HEIGHT } from "../../data/scheduleGrid";
import { useEditeMode } from "../../hooks";
import  { useHandleSelection } from "../../hooks/useHandleSelection";
import type { ColumnAppointmentsType } from "../../types";

export function CellsLayer({
  columnAppointments,
  idDoctor,
}: {
  columnAppointments: ColumnAppointmentsType[];
  idDoctor: string;
}): React.ReactNode {
  const selection = useHandleSelection((state) => state.selection);
  const isSelecting = useHandleSelection((state) => state.isSelecting);
  const onMouseDown = useHandleSelection((state) => state.onMouseDown);
  const onMouseEnter = useHandleSelection((state) => state.onMouseEnter);
  const isEditMode = useEditeMode((state) => state.isEditMode);

  return Array.from({ length: TOTAL_SLOTS }).map((_, slotIdx) => {
    const slotMinutesStart = slotIdx * ROW_MINUTES;
    const isOccupied = columnAppointments.some(
      (a) => slotMinutesStart >= a.start && slotMinutesStart < a.end,
    );

    if (isOccupied)
      return <div key={slotIdx} style={{ height: SLOT_HEIGHT }} />;

    return (
      <div
        key={slotIdx}
        style={{ height: SLOT_HEIGHT }}
        onMouseDown={(e) =>
          onMouseDown(e, {
            idDoctor,
            isEditMode,
            slotIdx,
          })
        }
        onMouseEnter={() => onMouseEnter({ idDoctor, slotIdx })}
        className="w-full h-full relative group transition-colors duration-150 cursor-crosshair border-b border-transparent"
      >
        {/* Hover placeholder indicator */}
        {!isSelecting && !selection && (
          <div className="absolute inset-x-3 inset-y-1 rounded-xl border border-dashed border-[#0066ff]/40 bg-blue-50/60 shadow-3xs items-center justify-center hidden group-hover:flex transition-all">
            {/* <Plus className="w-4 h-4 text-[#0066ff] stroke-[3]" /> */}
            <Plus className="w-4 h-4 text-[#0066ff] stroke-3" />
          </div>
        )}
      </div>
    );
  });
}