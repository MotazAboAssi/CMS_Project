import { Button } from "@/components/ui/button";
import { Calendar, Clock, GripVertical } from "lucide-react"; // استيراد الأيقونة للمقبض
import { useEditeMode } from "../../hooks/useEditeMode";

export function PendingRequestSection() {
  const isEditMode = useEditeMode((state) => state.isEditMode);

  return (
    <div className="flex-1 flex flex-col min-h-0 p-5">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-1.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            Pending requests:
          </h4>
          <span className="bg-red-50 text-red-500 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-red-100">
            3
          </span>
        </div>
      </div>

      {/* الحاوية وبداخلها الكروت المحدثة بـ Grip Handle */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-neutral-200">
  {[1, 2, 3, 4, 5].map((item) => (
    <div
      key={item}
      className={`bg-white border text-right transition-all duration-350 ease-in-out flex relative overflow-hidden min-h-[110px] ${
        isEditMode 
          ? "border-neutral-300 rounded-xl shadow-xs cursor-grab active:cursor-grabbing" 
          : "border-neutral-200 rounded-xl shadow-2xs hover:border-neutral-300"
      }`}
    >
      {/* ممسك السحب الجانبي الذكي مع أنيميشن الانزلاق والتلاشي اللطيف */}
      <div
        className={`bg-neutral-50/80 border-r border-neutral-200 flex items-center justify-center shrink-0 transition-all duration-350 ease-in-out select-none ${
          isEditMode 
            ? "w-9 opacity-100 scale-100" 
            : "w-0 opacity-0 scale-90 pointer-events-none border-r-transparent"
        }`}
      >
        <GripVertical 
          className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${
            isEditMode ? "rotate-0 scale-100" : "-rotate-90 scale-75"
          }`} 
        />
      </div>

      {/* محتوى الكرت الداخلي - يتجاوب تلقائياً مع انزلاق الممسك بمرونة */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0 transition-all duration-350">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-neutral-900 truncate">
              Folan Alfolani
            </h5>
            <p className="flex items-center text-[11px] text-neutral-400 font-medium mt-0.5 gap-1 truncate">
              <Calendar className="w-3 h-3 text-neutral-400 shrink-0" /> Dr. Folan Alfolani
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#0066ff] bg-blue-50/70 border border-blue-100 px-1.5 py-0.5 rounded-md shrink-0">
            1 d ago
          </span>
        </div>

        <div className="flex flex-col justify-between text-[11px] font-semibold text-neutral-500 mt-2">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-neutral-400" /> 5/5/2026
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-neutral-400" /> 2:00 PM
          </div>
        </div>

        {/* زر المراجعة يختفي بنعومة عند تفعيل وضع التعديل لتركيز انتباه المستخدم */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isEditMode ? "max-h-0 mt-0 opacity-0 pointer-events-none" : "max-h-12 mt-3 opacity-100"
          }`}
        >
          <Button className="w-full h-8 bg-[#39A3FF] hover:bg-[#258ce5] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors">
            Review
          </Button>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}
