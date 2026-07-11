import { create } from "zustand";
import type { PendingRequest } from "../types"; // تأكد من المسار الصحيح للـ types

interface Type {
  isWizardOpen: boolean;
  onClose: () => void;
  onOpenNewAppointment: (initData?: { doctorId: string; timeSlot: number; duration: number }) => void;
  // إضافة حقل جديد للاحتفاظ ببيانات الطلب أثناء المراجعة 👇
  pendingRequestData: PendingRequest | null;
  openWithPendingRequest: (request: PendingRequest) => void;
  initialData: { doctorId: string; timeSlot: number; duration: number } | null;
}

export const useWizardDrawer = create<Type>((set) => ({
  isWizardOpen: false,
  initialData: null,
  pendingRequestData: null, // القيمة الابتدائية
  onClose: () => set({ isWizardOpen: false, initialData: null, pendingRequestData: null }),
  onOpenNewAppointment: (initData) => set({ isWizardOpen: true, initialData: initData || null, pendingRequestData: null }),
  // ميثود فتح الدروار مع حقن بيانات الطلب بالكامل 👇
  openWithPendingRequest: ( request) => set({ isWizardOpen: true, pendingRequestData: request, initialData: null }),
}));