import type { ColumnAppointmentsType } from ".";

export  interface DoctorWithApts {
  id: string;
  name: string;
  specialty?: string;
  patients?: number;
  avatar?: string;
  appointments?: ColumnAppointmentsType[];
  columnAppointments?: ColumnAppointmentsType[];
}