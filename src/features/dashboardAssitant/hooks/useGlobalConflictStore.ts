import { create } from "zustand";
import type { ExtendedAppointmentType } from "../types";

export interface ConflictingItem {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  visitType: string;
  start: number;
  end: number;
  overlapMinutes: number;
  severity: "critical" | "warning";
  priorityScore: number; // من 1 إلى 10
  phone: string;
}

export interface ConflictPayload {
  draggedApt: ExtendedAppointmentType;
  targetDoctorId: string;
  targetStart: number;
  targetEnd: number;
  conflictingItems: ConflictingItem[];
}

interface GlobalConflictStore {
  conflictPayload: ConflictPayload | null;
  isDrawerOpen: boolean;
  setConflict: (payload: ConflictPayload | null) => void;
  setDrawerOpen: (isOpen: boolean) => void;
  clearConflict: () => void;
}

// 🧠 مُحرّك حساب الأولويات الطبي (Priority Calculation Model)
export function calculatePriorityScore(apt: ExtendedAppointmentType, overlap: number): { score: number; severity: "critical" | "warning" } {
  let score = 5; // القيمة الابتدائية
  
  // 1. حسب نوع الحالة واستعجالها
  if (apt.status === "urgent") score += 3;
  if (apt.status === "in_progress") score += 2;
  
  // 2. تداخل حرج (أكثر من 15 دقيقة)
  if (overlap > 15) score += 2;
  
  // 3. تحليل الكلمات الدلالية في العنوان للخطورة الزائدة
  const titleLower = (apt.title || "").toLowerCase();
  if (titleLower.includes("elderly") || titleLower.includes("heart") || titleLower.includes("blood")) {
    score += 1;
  }

  const finalScore = Math.min(Math.max(score, 1), 10);
  return {
    score: finalScore,
    severity: finalScore >= 8 ? "critical" : "warning"
  };
}

export const useGlobalConflictStore = create<GlobalConflictStore>((set) => ({
  conflictPayload: null,
  isDrawerOpen: false,
  setConflict: (payload) => set({ conflictPayload: payload }),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  clearConflict: () => set({ conflictPayload: null, isDrawerOpen: false }),
}));