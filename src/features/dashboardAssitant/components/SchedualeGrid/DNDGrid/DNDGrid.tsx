import {
  DndContext,  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import {
  INITIAL_DOCTORS,
  TOTAL_SLOTS,
  SLOT_HEIGHT,
  START_TIME_MINUTES,
  ROW_MINUTES,
  APPOINTMENTS,
} from "../../../data/scheduleGrid";
import { useHandleSelection, useEditeMode } from "../../../hooks";
import {
  BackgroundGridLine,
  DoctorsColumnLayout,
  RedTimeLine,
  TimeColumn,
  TopStickyHeader,
} from "..";
import { AppointmentUpdateToast } from "../AppointmentUpdateToast";
import type { DoctorWithApts, DragDataPayload } from "@/features/dashboardAssitant/types";
import { gridCollisionStrategy } from ".";






export function DNDGrid() {
  const [doctors, setDoctors] = useState<DoctorWithApts[]>(() => {
    return INITIAL_DOCTORS.map((doc) => ({
      ...doc,
      appointments: APPOINTMENTS.filter((apt) => apt.docId === doc.id),
    }));
  });

  const isEditMode = useEditeMode((state) => state.isEditMode);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<
    "doctor" | "appointment" | "pending_request" | null
  >(null);
  const [activeData, setActiveData] = useState<DragDataPayload | null>(null);

  const [overSlotInfo, setOverSlotInfo] = useState<{
    docId: string;
    slotIdx: number;
    top: number;
    height: number;
  } | null>(null);

  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    patientName: "",
    newTimeLabel: "",
  });
  const [snapshotDoctors, setSnapshotDoctors] = useState<
    DoctorWithApts[] | null
  >(null);

  const handleSelectionCommit = useHandleSelection(
    (state) => state.handleSelectionCommit,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  // دالة حساب الدقائق الحالية منذ الساعة 12:00 صباحاً لمقارنتها بمخطط الوقت اليومي
  const now = new Date();
  const currentMinutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

  const formatMinutesToTime = (minutesSinceStart: number, duration: number) => {
    const formatTime = (totalMins: number) => {
      const h = Math.floor(totalMins / 60) % 24;
      const m = totalMins % 60;
      const displayH = h === 0 || h === 12 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      return `${displayH}:${m === 0 ? "00" : m < 10 ? "0" + m : m} ${ampm}`;
    };
    const totalStart = START_TIME_MINUTES + minutesSinceStart;
    return `${formatTime(totalStart)} - ${formatTime(totalStart + duration)}`;
  };

  const formatDisplayTimeRange = (startMins: number, endMins: number) => {
    const formatSingle = (mins: number) => {
      const total = START_TIME_MINUTES + mins;
      const h = Math.floor(total / 60) % 24;
      const m = total % 60;
      const displayH = h === 0 || h === 12 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      return `${displayH}:${m === 0 ? "00" : m < 10 ? "0" + m : m}${ampm}`;
    };
    return `${formatSingle(startMins)} - ${formatSingle(endMins)}`;
  };

  function handleDragStart(event: DragStartEvent) {
    if (!isEditMode) return;
    const { active } = event;

    const currentData = active.data.current as DragDataPayload | undefined;

    // التحقق الفوري: إذا كان الحجز قديماً ومجتازاً للوقت الحالي، نمنع بدء عملية السحب كلياً
    if (currentData?.type === "appointment" && currentData.appointmentData) {
      const absoluteAptEndMinutes =
        START_TIME_MINUTES + currentData.appointmentData.end;
      if (currentMinutesSinceMidnight > absoluteAptEndMinutes) {
        return; // إلغاء السحب فوراً للمواعيد الفائتة
      }
    }

    setActiveId(active.id as string);
    const type =
      currentData?.type || (active.data.current?.sortable ? "doctor" : null);

    setActiveType(type);
    setActiveData(currentData || null);

    setSnapshotDoctors(JSON.parse(JSON.stringify(doctors)));
    setIsToastOpen(false);
  }

  function handleDragOver(event: DragOverEvent) {
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
        const topOffset = targetSlotIdx * SLOT_HEIGHT;
        const cardHeight = (duration / ROW_MINUTES) * SLOT_HEIGHT;

        setOverSlotInfo({
          docId: targetDoctorId,
          slotIdx: targetSlotIdx,
          top: topOffset,
          height: cardHeight,
        });
        return;
      }
    }
    setOverSlotInfo(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);
    setActiveType(null);
    setActiveData(null);
    setOverSlotInfo(null);

    if (!over || !isEditMode) return;

    if (
      active.data.current?.type === "doctor" ||
      active.data.current?.sortable
    ) {
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
          const currentApts = doc.appointments || [];
          const filteredApts = currentApts.filter(
            (a) => a && a.id !== active.id,
          );

          if (doc.id === targetDoctorId) {
            filteredApts.push({
              ...payloadData,
              start: newStart,
              end: newEnd,
              docId: targetDoctorId,
            });
          }
          return {
            ...doc,
            appointments: filteredApts,
          };
        }),
      );

      const titleString = payloadData.title || "Appointment";
      setToastInfo({
        patientName: titleString.split(" - ")[0],
        newTimeLabel: formatMinutesToTime(newStart, duration),
      });
      setIsToastOpen(true);
    }
  }

  const handleUndoAction = () => {
    if (snapshotDoctors) {
      setDoctors(snapshotDoctors);
      setSnapshotDoctors(null);
    }
  };

  const draggingAppointmentDuration = activeData?.appointmentData
    ? activeData.appointmentData.end - activeData.appointmentData.start
    : 0;
  const overlayCardHeight =
    (draggingAppointmentDuration / ROW_MINUTES) * SLOT_HEIGHT;

  // تحديد ستايل وثيم الكارت المسحوب بناءً على حالة الـ status لمحاكاة التصميم المرفق
  const getStatusOverlayStyles = (status?: string) => {
    switch (status) {
      case "urgent":
        return "bg-[#FFF2ED] border-orange-300 text-orange-800";
      case "in_progress":
        return "bg-purple-50 border-purple-300 text-purple-800";
      case "unavailable":
        return "bg-neutral-50 border-neutral-300 text-neutral-500 border-dashed";
      case "confirmed":
      default:
        return "bg-[#E2F1FF] border-blue-300 text-[#0055cc]";
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={gridCollisionStrategy} // 👈 هنا تم استبدال closestCenter بالاستراتيجية الذكية المخصصة
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto whitespace-nowrap relative scrollbar-thin antialiased">
        <div className="w-full flex flex-col min-w-max">
          <SortableContext
            items={doctors.map((d) => d.id)}
            strategy={horizontalListSortingStrategy}
          >
            <TopStickyHeader doctors={doctors as DoctorWithApts[]} />
            <div className="flex relative" onMouseUp={handleSelectionCommit}>
              <TimeColumn />
              <div
                className="flex-1 flex divide-x divide-neutral-200 relative bg-white"
                style={{ height: TOTAL_SLOTS * SLOT_HEIGHT }}
              >
                <BackgroundGridLine />
                <RedTimeLine />

                <DoctorsColumnLayout
                  doctors={doctors as DoctorWithApts[]}
                  overSlotInfo={overSlotInfo}
                />
              </div>
            </div>
          </SortableContext>
        </div>
      </div>

      {/* الـ DragOverlay المصمم ليعكس كارت التصميم الجديد تماماً أثناء الطيران */}
      <DragOverlay dropAnimation={null}>
        {activeId &&
        activeType === "appointment" &&
        activeData?.appointmentData ? (
          <div
            style={{ height: overlayCardHeight - 6 }}
            className={`w-[334px] border p-3 rounded-xl shadow-xl flex relative items-start select-none opacity-90 pointer-events-none z-50 ${getStatusOverlayStyles(activeData.appointmentData.status)}`}
          >
            {/* مقبض السحب المرقط المحاكي للصورة الجانبية */}
            <div className="mr-2 mt-0.5 text-neutral-400 flex flex-col gap-0.5 cursor-grabbing">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                {activeData.appointmentData.status === "urgent" && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                    !
                  </span>
                )}
                <h5 className="font-semibold text-neutral-800 text-xs truncate">
                  {activeData.appointmentData.title?.split(" - ")[0] ||
                    "Patient Name"}
                </h5>
              </div>
              <p className="text-[10px] font-medium opacity-75 mt-0.5">
                {formatDisplayTimeRange(
                  activeData.appointmentData.start,
                  activeData.appointmentData.end,
                )}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      <AppointmentUpdateToast
        isOpen={isToastOpen}
        patientName={toastInfo.patientName}
        newTimeLabel={toastInfo.newTimeLabel}
        onClose={() => setIsToastOpen(false)}
        onUndo={handleUndoAction}
      />
    </DndContext>
  );
}
