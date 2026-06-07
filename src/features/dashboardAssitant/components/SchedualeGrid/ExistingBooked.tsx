import { cn } from "@/lib/utils";
import {
  ROW_MINUTES,
  SLOT_HEIGHT,
  START_TIME_MINUTES,
} from "../../data/scheduleGrid";
import type { ColumnAppointmentsType } from "../../types";
import { useEditeMode, useRedLine } from "../../hooks"; // استدعاء الهوكس الحركية وزمن الخط الأحمر
import { GripVertical, Lock } from "lucide-react"; // استيراد الأيقونات للمقبض والقفل

export function ExistingBooked({
  columnAppointments,
}: {
  columnAppointments: ColumnAppointmentsType[];
}): React.ReactNode {
  const isEditMode = useEditeMode((state) => state.isEditMode);
  const timeLineTop = useRedLine((state) => state.timeLineTop);

  // حساب الدقائق الحالية الفعلية بناءً على إحداثيات الخط الأحمر المتزامن
  const currentMinutesSinceGridStart =
    (timeLineTop / SLOT_HEIGHT) * ROW_MINUTES;

  return columnAppointments.map((apt) => {
    const topOffset = (apt.start / ROW_MINUTES) * SLOT_HEIGHT;
    const cardHeight = ((apt.end - apt.start) / ROW_MINUTES) * SLOT_HEIGHT;

    // الشرط الذكي: الموعد يعتبر قديماً/فائتاً إذا بدأ قبل أو يساوي خط الوقت الحالي
    const isPastAppointment = apt.start <= currentMinutesSinceGridStart;

    // تحديد الأيقونة والوضعية البرمجية
    const showLockIcon = isEditMode && isPastAppointment;
    const showGripHandle = isEditMode && !isPastAppointment;
    const isDragDisabled = !isEditMode || isPastAppointment;

    const startH = Math.floor((START_TIME_MINUTES + apt.start) / 60) % 24;
    const startM = (START_TIME_MINUTES + apt.start) % 60;
    const endH = Math.floor((START_TIME_MINUTES + apt.end) / 60) % 24;
    const endM = (START_TIME_MINUTES + apt.end) % 60;

    const formatTimeLabel = (h: number, m: number) => {
      const displayH = h === 0 || h === 12 ? 12 : h % 12;
      const ampm = h >= 12 ? "PM" : "AM";
      return `${displayH}:${m === 0 ? "00" : m < 10 ? "0" + m : m} ${ampm}`;
    };

    return (
      <div
  key={apt.id}
  style={{
    top: topOffset + 3,
    height: cardHeight - 6,
  }}
  className={cn(
    "absolute left-2 right-2 rounded-xl flex transition-all duration-350 ease-in-out shadow-xs group z-10 overflow-hidden select-none border",
    
    // إدارة مؤشر الماوس وشكل الحدود الخارجية بناءً على حالة التعديل
    showGripHandle && "cursor-grab active:cursor-grabbing hover:shadow-md border-dashed",
    showLockIcon && "opacity-85 border-solid cursor-not-allowed",
    !isEditMode && "cursor-pointer",

    // الخلفيات والألوان الأصلية
    apt.status === "confirmed" && "bg-[#E2F1FF] border-blue-200/80 text-[#0055cc]",
    apt.status === "urgent" && "bg-red-50 border-red-200/80 text-red-700",
    apt.status === "in_progress" && "bg-purple-50 border-purple-200/80 text-purple-700",
    apt.status === "late" && "bg-amber-50 border-amber-200/80 text-amber-700",
    apt.status === "unavailable" && "bg-neutral-50 border-neutral-200 text-neutral-400 line-through opacity-75",
  )}
  {...(isDragDisabled ? {} : { dataHtmlDrag: "true" })} 
>
  {/* المقبض الجانبي الذكي: يتوسع، تظهر الأيقونة، وتتغير الحدود الداخلية بأنيميشن متزامن */}
  <div
    className={cn(
      "flex items-center justify-center shrink-0 border-r transition-all duration-350 ease-in-out bg-black/[0.02]",
      isEditMode ? "w-8 opacity-100" : "w-0 opacity-0 pointer-events-none border-r-transparent",
      
      // مطابقة لون الخط الفاصل الداخلي مع حالة الكرت الملونة
      apt.status === "confirmed" && "border-blue-200/50",
      apt.status === "urgent" && "border-red-200/50",
      apt.status === "in_progress" && "border-purple-200/50",
      apt.status === "late" && "border-amber-200/50",
      apt.status === "unavailable" && "border-neutral-200/50",
    )}
  >
    {showGripHandle && (
      <GripVertical 
        className={cn(
          "w-4 h-4 shrink-0 text-current opacity-70 group-hover:opacity-100 transition-all duration-350",
          isEditMode ? "scale-100 rotate-0" : "scale-75 -rotate-45"
        )} 
      />
    )}
    {showLockIcon && (
      <Lock 
        className={cn(
          "w-4 h-4 shrink-0 text-neutral-400 opacity-60 transition-all duration-350",
          isEditMode ? "scale-100" : "scale-75"
        )} 
      />
    )}
  </div>

  {/* حاوية المحتوى والمعلومات - تنسحب لليمين بنعومة وثبات عند ظهور المقبض */}
  <div className="flex-1 p-3 flex flex-col justify-between text-xs min-w-0 transition-all duration-350">
    <div className="flex items-start gap-1.5 min-w-0">
      {/* النقطة الحمراء للمواعيد الطارئة تظهر فقط في الوضع العادي، وتختفي في التعديل لتوفير مساحة بصرية */}
      <div 
        className={cn(
          "transition-all duration-200 overflow-hidden",
          apt.status === "urgent" && !showLockIcon && !showGripHandle ? "w-1.5 opacity-100 mr-1" : "w-0 opacity-0 mr-0"
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 block mt-1.5 shrink-0" />
      </div>
      
      <div className="min-w-0 flex-1">
        <p className="font-bold truncate leading-none text-neutral-900 transition-colors">
          Patient Name
        </p>
        <p className="text-[10px] font-semibold opacity-75 mt-1.5 leading-none truncate">
          {formatTimeLabel(startH, startM)} - {formatTimeLabel(endH, endM)}
        </p>
      </div>
    </div>
  </div>
</div>
    );
  });
}
