import { create } from "zustand";
import type { SelectionType } from "../types";
import { APPOINTMENTS, ROW_MINUTES } from "../data/scheduleGrid";

interface HandleSelectionState {
  selection: SelectionType;
  isSelecting: boolean;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleSelectionCommit: () => void;
  handleCreateAppointment: (e: React.MouseEvent) => void;
  // Fix 1: Updated signature to match your implementation parameters
  onMouseEnter: (params: { idDoctor: string; slotIdx: number }) => void;
  onMouseDown: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    params: { isEditMode: boolean; idDoctor: string; slotIdx: number },
  ) => void;
}

export const useHandleSelection = create<HandleSelectionState>((set) => {
  const isTimeRangeOccupied = (
    docId: string,
    startMinutes: number,
    endMinutes: number,
  ) => {
    const columnAppointments = APPOINTMENTS.filter((a) => a.docId === docId);
    return columnAppointments.some(
      (apt) => startMinutes < apt.end && endMinutes > apt.start,
    );
  };

  return {
    selection: null,
    isSelecting: false,

    handleKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        set({ selection: null, isSelecting: false });
      }
    },

    handleSelectionCommit: () => {
      set({ isSelecting: false });
    },

    handleCreateAppointment: (e: React.MouseEvent) => {
      e.stopPropagation();

      set((state) => {
        if (state.selection) {
          const minSlot = Math.min(
            state.selection.startSlot,
            state.selection.endSlot,
          );
          const maxSlot = Math.max(
            state.selection.startSlot,
            state.selection.endSlot,
          );
          const totalParts = maxSlot - minSlot + 1;

          console.log(
            `Creating appointment for: ${state.selection.docId}, starting cell: ${minSlot}, duration slots: ${totalParts}`,
          );

          return { selection: null };
        }

        return {};
      });
    },

    onMouseDown: (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      { idDoctor, isEditMode, slotIdx },
    ) => {
      if (isEditMode || e.button !== 0) return;
      set({
        isSelecting: true,
        selection: {
          docId: idDoctor,
          startSlot: slotIdx,
          endSlot: slotIdx,
        },
      });
    },

    onMouseEnter: ({ idDoctor, slotIdx }) =>
      set((state) => {
        if (
          !state.isSelecting ||
          !state.selection ||
          state.selection.docId !== idDoctor
        ) {
          return {};
        }

        const potentialMinSlot = Math.min(state.selection.startSlot, slotIdx);
        const potentialMaxSlot = Math.max(state.selection.startSlot, slotIdx);

        const targetStartMinutes = potentialMinSlot * ROW_MINUTES;
        const targetEndMinutes = (potentialMaxSlot + 1) * ROW_MINUTES;

        if (!isTimeRangeOccupied(idDoctor, targetStartMinutes, targetEndMinutes)) {
          // Fix 2: Return the state mutations explicitly instead of calling a nested set()
          return {
            selection: {
              ...state.selection,
              endSlot: slotIdx,
            },
          };
        }
        
        return {};
      }),
  };
});