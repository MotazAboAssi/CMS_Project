import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export function PendingRequestSection() {
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

      {/* Scroll Container Area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-neutral-200">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="p-3 bg-white border border-neutral-200 rounded-xl shadow-2xs hover:border-neutral-300 transition-all flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <h5 className="text-xs font-bold text-neutral-900">
                  Folan Alfolani
                </h5>
                <p className="flex items-center text-[11px] text-neutral-400 font-medium mt-0.5 gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" /> Dr. Folan
                  Alfolani
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#0066ff] bg-blue-50/70 border border-blue-100 px-1.5 py-0.5 rounded-md">
                1 d ago
              </span>
            </div>

            <div className="flex flex-col justify-between  text-[11px] font-semibold text-neutral-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-400" /> 5/5/2026
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" /> 2:00 PM
              </div>
            </div>
            <Button className="w-full h-8 mt-3 bg-[#39A3FF] hover:bg-[#258ce5] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors">
              Review
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}