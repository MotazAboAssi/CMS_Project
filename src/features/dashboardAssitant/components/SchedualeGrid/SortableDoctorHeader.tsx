import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DoctorType } from "../../types";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react"; // استيراد أيقونة المقبض السداسي

export function SortableDoctorHeader({
  id,
  doctor,
  disabled,
}: {
  id: string;
  doctor: DoctorType;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white p-3.5 flex items-center justify-between transition-all w-full h-16",
        isDragging && "shadow-lg bg-neutral-50/90 z-50 relative opacity-90",
        !disabled && "cursor-grab active:cursor-grabbing hover:bg-neutral-50/80",
      )}
    >
      <div
        className="flex items-center gap-3 min-w-0 w-full justify-between"
        {...(!disabled ? { ...attributes, ...listeners } : {})}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-9 h-9 rounded-xl border border-neutral-200/80 shrink-0 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-neutral-900 truncate leading-none">
              {doctor.name}
            </h4>
            <p className="text-[11px] font-semibold text-neutral-400 mt-1.5 leading-none">
              {doctor.patients} patients
            </p>
          </div>
        </div>

        {/* إضافة مقبض السحب على اليمين عند تفعيل الـ Edit Mode (عندما يكون disabled يساوي false) */}
        {!disabled && (
          <GripVertical className="w-4 h-4 text-neutral-400 shrink-0 ml-1.5" />
        )}
      </div>
    </div>
  );
}