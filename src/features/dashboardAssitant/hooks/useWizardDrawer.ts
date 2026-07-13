import { create } from "zustand";
import type { PendingRequest } from "../types";

interface Type {
  isWizardOpen: boolean;
  onClose: () => void;
  onOpenNewAppointment: (initData?: {
    doctorId: string;
    timeSlot: number;
    duration: number;
    date: Date;
  }) => void;
  pendingRequestData: PendingRequest | null;
  openWithPendingRequest: (request: PendingRequest) => void;
  initialData: {
    doctorId: string;
    timeSlot: number;
    duration: number;
    date: Date;
  } | null;
}

export const useWizardDrawer = create<Type>((set) => ({
  isWizardOpen: false,
  initialData: null,
  pendingRequestData: null,
  onClose: () =>
    set({ isWizardOpen: false, initialData: null, pendingRequestData: null }),
  onOpenNewAppointment: (initData) =>
    set({
      isWizardOpen: true,
      initialData: initData || null,
      pendingRequestData: null,
    }),
  openWithPendingRequest: (request) =>
    set({ isWizardOpen: true, pendingRequestData: request, initialData: null }),
}));
