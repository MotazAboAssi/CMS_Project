import type { ExtendedAppointmentType } from ".";

export interface ExistingBookedProps {
  columnAppointments: ExtendedAppointmentType[];
  docId: string;
  overSlotInfo?: {
    docId: string;
    slotIdx: number;
    top: number;
    height: number;
  } | null;
}