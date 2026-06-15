export interface ExtendedAppointmentType {
  id: string;
  start: number;
  end: number;
  docId: string;
  status: string;
  title?: string;
  patientName?: string;
  patient?: { name: string };
}