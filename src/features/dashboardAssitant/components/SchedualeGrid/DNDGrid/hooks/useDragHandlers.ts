import { useState, useCallback, useMemo } from "react";
import {
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  INITIAL_DOCTORS,
  SLOT_HEIGHT,
  START_TIME_MINUTES,
  ROW_MINUTES,
  APPOINTMENTS,
} from "../../../../data/scheduleGrid";
import { useEditeMode } from "../../../../hooks";
import { formatMinutesToTime } from "../utils/timeFormatters";
import { useCurrentTime } from "./useCurrentTime";
import type { ColumnAppointmentsType, DoctorWithApts, DragDataPayload, ExtendedAppointmentType } from "@/features/dashboardAssitant/types";
import type { OverSlotInfo, ToastInfo, ActiveDragType } from "../types/dragTypes";

export function useDragHandlers() {
  const [doctors, setDoctors] = useState<DoctorWithApts[]>(() =>
    INITIAL_DOCTORS.map((doc) => ({
      ...doc,
      appointments: APPOINTMENTS.filter((apt) => apt.docId === doc.id),
    }))
  );

  const isEditMode = useEditeMode((state) => state.isEditMode);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ActiveDragType>(null);
  const [activeData, setActiveData] = useState<DragDataPayload | null>(null);
  const [overSlotInfo, setOverSlotInfo] = useState<OverSlotInfo | null>(null);
  const [snapshotDoctors, setSnapshotDoctors] = useState<DoctorWithApts[] | null>(null);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo>({
    patientName: "",
    newTimeLabel: "",
  });

  const currentMinutesSinceMidnight = useCurrentTime();

  // New handler for modifying appointments directly via context menu actions
  const updateAppointment = useCallback(
    (updatedApt: ExtendedAppointmentType) => {
      // 1. Snapshot full state for robust Undo tracking
      setSnapshotDoctors(JSON.parse(JSON.stringify(doctors)));
      setIsToastOpen(false);

      // 2. Perform cross-doctor atomic immutable state swap
      setDoctors((prev) =>
        prev.map((doc) => {
          const filteredApts = (doc.appointments || []).filter(
            (a) => a && a.id !== updatedApt.id
          );

          if (doc.id === updatedApt.docId) {
            filteredApts.push(updatedApt as ColumnAppointmentsType);
          }

          return { ...doc, appointments: filteredApts };
        })
      );

      // 3. Trigger corresponding operational success toast
      const duration = updatedApt.end - updatedApt.start;
      const titleString = updatedApt.title || "Appointment";
      setToastInfo({
        patientName: titleString.split(" - ")[0],
        newTimeLabel: formatMinutesToTime(updatedApt.start, duration),
      });
      setIsToastOpen(true);
    },
    [doctors]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (!isEditMode) return;

      const { active } = event;
      const currentData = active.data.current as DragDataPayload | undefined;

      if (currentData?.type === "appointment" && currentData.appointmentData) {
        const absoluteAptEndMinutes =
          START_TIME_MINUTES + currentData.appointmentData.end;
        if (currentMinutesSinceMidnight > absoluteAptEndMinutes) {
          return;
        }
      }

      setActiveId(active.id as string);
      setActiveType(currentData?.type ?? (active.data.current?.sortable ? "doctor" : null));
      setActiveData(currentData ?? null);
      setSnapshotDoctors(JSON.parse(JSON.stringify(doctors)));
      setIsToastOpen(false);
    },
    [isEditMode, currentMinutesSinceMidnight, doctors]
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { over } = event;
      if (!over || !isEditMode || activeType !== "appointment") {
        setOverSlotInfo(null);
        return;
      }

      if (over.data.current?.type === "slot") {
        const targetDoctorId = over.data.current.idDoctor;
        const targetSlotIdx = over.data.current.slotIdx;
        const aptData = activeData?.appointmentData;

        if (aptData) {
          const duration = aptData.end - aptData.start;
          setOverSlotInfo({
            docId: targetDoctorId,
            slotIdx: targetSlotIdx,
            top: targetSlotIdx * SLOT_HEIGHT,
            height: (duration / ROW_MINUTES) * SLOT_HEIGHT,
          });
          return;
        }
      }
      setOverSlotInfo(null);
    },
    [isEditMode, activeType, activeData]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setActiveType(null);
      setActiveData(null);
      setOverSlotInfo(null);

      if (!over || !isEditMode) return;

      if (active.data.current?.type === "doctor" || active.data.current?.sortable) {
        if (active.id !== over.id) {
          setDoctors((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            return arrayMove(items, oldIndex, newIndex) as DoctorWithApts[];
          });
        }
        return;
      }

      if (activeType === "appointment" && over.data.current?.type === "slot") {
        const targetDoctorId = over.data.current.idDoctor;
        const targetSlotIdx = over.data.current.slotIdx;
        const payloadData = active.data.current?.appointmentData;

        if (!payloadData) return;

        const duration = payloadData.end - payloadData.start;
        const newStart = targetSlotIdx * ROW_MINUTES;
        const newEnd = newStart + duration;

        setDoctors((prev) =>
          prev.map((doc) => {
            const filteredApts = (doc.appointments || []).filter(
              (a) => a && a.id !== active.id
            );

            if (doc.id === targetDoctorId) {
              filteredApts.push({
                ...payloadData,
                start: newStart,
                end: newEnd,
                docId: targetDoctorId,
              });
            }

            return { ...doc, appointments: filteredApts };
          })
        );

        const titleString = payloadData.title || "Appointment";
        setToastInfo({
          patientName: titleString.split(" - ")[0],
          newTimeLabel: formatMinutesToTime(newStart, duration),
        });
        setIsToastOpen(true);
      }
    },
    [isEditMode, activeType]
  );

  const handleUndoAction = useCallback(() => {
    if (snapshotDoctors) {
      setDoctors(snapshotDoctors);
      setSnapshotDoctors(null);
    }
  }, [snapshotDoctors]);

  const closeToast = useCallback(() => setIsToastOpen(false), []);

  const overlayMeta = useMemo(() => {
    const duration = activeData?.appointmentData
      ? activeData.appointmentData.end - activeData.appointmentData.start
      : 0;
    return {
      cardHeight: (duration / ROW_MINUTES) * SLOT_HEIGHT,
      duration,
    };
  }, [activeData]);
  // Inside useDragHandlers.ts — add this handler function:
const addAppointment = useCallback((newApt: ColumnAppointmentsType) => {
  setDoctors((prevDoctors) =>
    prevDoctors.map((doc) => {
      if (doc.id === newApt.docId) {
        return {
          ...doc,
          appointments: [...(doc.appointments || []), newApt],
        };
      }
      return doc;
    })
  );
}, []);

// Expose it at the bottom return block of your hook:
return {
  doctors,
  activeId,
  activeType,
  activeData,
  overSlotInfo,
  isToastOpen,
  toastInfo,
  overlayMeta,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  handleUndoAction,
  closeToast,
  updateAppointment,
  addAppointment, // ✅ Exported here
};

}