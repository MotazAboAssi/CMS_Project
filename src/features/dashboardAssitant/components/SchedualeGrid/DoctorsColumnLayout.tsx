import { cn } from "@/lib/utils";
import {
  APPOINTMENTS,
  SLOT_HEIGHT,
  DOCTOR_COL_WIDTH,
} from "../../data/scheduleGrid";
import { useHandleSelection } from "../../hooks";
import type { DoctorType } from "../../types";
import { CellsLayer, ExistingBooked, PersistentSelectionArea } from ".";

export function DoctorsColumnLayout({
  doctors,
}: {
  doctors: DoctorType[];
}): React.ReactNode {
  const selection = useHandleSelection((state) => state.selection);

  return doctors.map((doctor) => {
    const columnAppointments = APPOINTMENTS.filter(
      (a) => a.docId === doctor.id,
    );
    const hasSelectionInColumn = selection?.docId === doctor.id;

    let selectionTop = 0;
    let selectionHeight = 0;
    if (hasSelectionInColumn && selection) {
      const minS = Math.min(selection.startSlot, selection.endSlot);
      const maxS = Math.max(selection.startSlot, selection.endSlot);
      selectionTop = minS * SLOT_HEIGHT;
      selectionHeight = (maxS - minS + 1) * SLOT_HEIGHT;
    }

    return (
      <div
        key={doctor.id}
        className={cn("h-full relative z-10", DOCTOR_COL_WIDTH)}
      >
        {/* Cells Layer */}
        <CellsLayer
          columnAppointments={columnAppointments}
          idDoctor={doctor.id}
        />

        {/* Persistent Selection Area overlay container */}
        <PersistentSelectionArea
          hasSelectionInColumn={hasSelectionInColumn}
          selectionHeight={selectionHeight}
          selectionTop={selectionTop}
        />

        {/* Existing booked cards */}
        <ExistingBooked columnAppointments={columnAppointments} />
      </div>
    );
  });
}
