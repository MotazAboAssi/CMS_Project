export interface DragDataPayload {
  type: "doctor" | "appointment" | "pending_request";
  appointmentData?: {
    id: string;
    start: number;
    end: number;
    docId: string;
    title?: string;
    status?: string;
  };
}