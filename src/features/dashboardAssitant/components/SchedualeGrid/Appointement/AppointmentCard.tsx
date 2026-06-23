import {
  ROW_MINUTES,
  SLOT_HEIGHT,
  START_TIME_MINUTES,
} from "@/features/dashboardAssitant/data/scheduleGrid";
import type { ExtendedAppointmentType } from "@/features/dashboardAssitant/types";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { ContentAppointementCard, SideIconAppointementCard } from ".";

export function AppointmentCard({
  apt,
  isEditMode,
  currentMinutesSinceGridStart,
}: {
  apt: ExtendedAppointmentType;
  isEditMode: boolean;
  currentMinutesSinceGridStart: number;
}) {
  const topOffset = (apt.start / ROW_MINUTES) * SLOT_HEIGHT;
  const cardHeight = ((apt.end - apt.start) / ROW_MINUTES) * SLOT_HEIGHT;

  // الشرط الذكي المعتمد على إحداثيات الخط الأحمر المتزامن الخاص بك
  const isPastAppointment = apt.start <= currentMinutesSinceGridStart;

  // معالجة الأيقونات والوضعية البرمجية الدقيقة للتصميم
  const showLockIcon = isEditMode && isPastAppointment;
  const showGripHandle = isEditMode && !isPastAppointment;
  const isDragDisabled = !isEditMode || isPastAppointment;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: apt.id,
    data: {
      type: "appointment",
      appointmentData: apt,
    },
    disabled: isDragDisabled,
  });

  const startH = Math.floor((START_TIME_MINUTES + apt.start) / 60) % 24;
  const startM = (START_TIME_MINUTES + apt.start) % 60;
  const endH = Math.floor((START_TIME_MINUTES + apt.end) / 60) % 24;
  const endM = (START_TIME_MINUTES + apt.end) % 60;

  const formatTimeLabel = (h: number, m: number) => {
    const displayH = h === 0 || h === 12 ? 12 : h % 12;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${displayH}:${m === 0 ? "00" : m < 10 ? "0" + m : m} ${ampm}`;
  };

  // معالجة النصوص لاستخراج الاسم ونوع الكشف بشكل ديناميكي لتفادي الهاردكود
  const appointement: {
    patientName: string;
    visitType: string;
  } = {
    patientName: "Unknown Patient",
    visitType: "General Consultation",
  };

  if (apt.title && apt.title.includes(" - ")) {
    const parts = apt.title.split(" - ");
    appointement.patientName = parts[0].trim();
    appointement.visitType = parts[1].trim();
  } else if (apt.title) {
    appointement.patientName = apt.title;
  } else {
    appointement.patientName =
      apt.patientName || apt.patient?.name || "Patient";
  }

  return (
    <div
      ref={setNodeRef}
      {...(!isDragDisabled ? listeners : {})}
      {...attributes}
      onDoubleClick={(e) => {
        if (isEditMode) {
          e.preventDefault();
          e.stopPropagation();
          // يرسل الحدث مباشرة لمنظم الشبكة المركزي لعرض القائمة المنبثقة
          window.dispatchEvent(
            new CustomEvent("open-appointment-menu", {
              detail: { appointment: apt, x: e.clientX, y: e.clientY },
            })
          );
        }
      }}
      style={{
        top: topOffset + 3,
        height: cardHeight - 6,
      }}
      className={cn(
        "absolute left-2 right-2 rounded-xl flex transition-all duration-350 ease-in-out shadow-xs group z-10 overflow-hidden select-none border box-border",
        isDragging &&
          "opacity-15 border-dashed bg-neutral-100 border-neutral-300 pointer-events-none",
        showGripHandle &&
          "cursor-grab active:cursor-grabbing hover:shadow-md border-dashed",
        showLockIcon && "opacity-85 border-solid cursor-not-allowed",
        !isEditMode && "cursor-pointer",

        // الألوان والخلفيات الأصلية المتوافقة مع الحالات
        apt.status === "confirmed" &&
          "bg-[#E2F1FF] border-blue-200/80 text-[#0055cc]",
        apt.status === "urgent" && "bg-red-50 border-red-200/80 text-red-700",
        apt.status === "in_progress" &&
          "bg-purple-50 border-purple-200/80 text-purple-700",
        apt.status === "late" &&
          "bg-amber-50 border-amber-200/80 text-amber-700",
        apt.status === "unavailable" &&
          "bg-neutral-50 border-neutral-200 text-neutral-400 line-through opacity-75",
      )}
    >
      {/* المقبض الجانبي المتحرك: يتمدد بـ w-8 في التعديل وينكمش إلى w-0 في العرض العادي */}
      <SideIconAppointementCard
        isEditMode={isEditMode}
        apt={apt}
        showGripHandle={showGripHandle}
        showLockIcon={showLockIcon}
      />

      {/* حاوية المحتوى والمعلومات المكتوبة */}
      <ContentAppointementCard
        apt={apt}
        showLockIcon={showLockIcon}
        showGripHandle={showGripHandle}
        appointement={appointement}
        formatTimeLabel={formatTimeLabel}
        startH={startH}
        startM={startM}
        endH={endH}
        endM={endM}
      />
    </div>
  );
}