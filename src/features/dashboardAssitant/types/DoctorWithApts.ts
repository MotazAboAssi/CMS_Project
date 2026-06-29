import type { ColumnAppointmentsType } from ".";

export  interface DoctorWithApts {
  id: string;
  name: string;
  patients?: number;
  avatar?: string;
  specialty?: string;
  appointments?: ColumnAppointmentsType[];
  columnAppointments?: ColumnAppointmentsType[];
}

