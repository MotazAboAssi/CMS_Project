
import type { ExistingBookedProps } from "@/features/dashboardAssitant/types";
import {
  ROW_MINUTES,
  SLOT_HEIGHT,
} from "../../../data/scheduleGrid";
import { useEditeMode, useRedLine } from "../../../hooks"; // استدعاء الهوكس المتزامنة بدقة
import { AppointmentCard } from ".";



export function ExistingBooked({
  columnAppointments,
  docId,
  overSlotInfo,
}: ExistingBookedProps) {
  const isEditMode = useEditeMode((state) => state.isEditMode);
  const timeLineTop = useRedLine((state) => state.timeLineTop);

  // حساب الدقائق المحدثة المأخوذة مباشرة من هوك الخط الزمني الخاص بك لتوحيد دقة البيانات
  const currentMinutesSinceGridStart =
    (timeLineTop / SLOT_HEIGHT) * ROW_MINUTES;

  return (
    <>
      {/* التظليل التوقعي السلس عند تحليق بطاقة السحب فوق خانة طبيب فارغة */}
      {overSlotInfo && overSlotInfo.docId === docId && (
        <div
          className="absolute left-2 right-2 rounded-xl bg-blue-500/5 border-2 border-dashed border-blue-400/30 z-0 pointer-events-none transition-all duration-75"
          style={{
            top: overSlotInfo.top + 3,
            height: overSlotInfo.height - 6,
          }}
        />
      )}

      {columnAppointments.map((apt) => (
        <AppointmentCard
          key={apt.id}
          apt={apt}
          isEditMode={isEditMode}
          currentMinutesSinceGridStart={currentMinutesSinceGridStart}
        />
      ))}
    </>
  );
}
