import { create } from "zustand";

interface Type {
  isWizardOpen: boolean;
  onClose: () => void;
  onOpenNewAppointment: (initData?: { doctorId: string; timeSlot: number,duration:number }) => void;
  initialData: { doctorId: string; timeSlot: number, duration:number } | null;
}

export const useWizardDrawer = create<Type>((set) => ({
  isWizardOpen: false,
  initialData: null,
  onClose: () => set({ isWizardOpen: false, initialData: null }),
  onOpenNewAppointment: (initData) => set({ isWizardOpen: true, initialData: initData || null }),
}));