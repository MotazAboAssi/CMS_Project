import { Button } from "@/components/ui/button";
import { useEditeMode } from "../../hooks/useEditeMode";
import { Edit3, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ControlButton() {
  const isEditMode = useEditeMode((state) => state.isEditMode);
  const onToggleEdit = useEditeMode((state) => state.onToggleEdit);
  return (
    <div className="p-4 space-y-2.5 border-b border-neutral-100">
      <Button className="w-full h-11 bg-[#0066ff] hover:bg-[#0052cc] text-white font-bold rounded-xl shadow-sm justify-center px-4 text-xs ">
        <Plus />
        <span>New appointment</span>
        <kbd className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white/90 font-mono">
          Ctrl + N
        </kbd>
      </Button>

      <Button
        variant="outline"
        onClick={onToggleEdit}
        className={cn(
          "w-full h-11 font-bold rounded-xl justify-center  px-4 text-xs border transition-colors",
          isEditMode
            ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50",
        )}
      >
        <Edit3 />
        <span>{isEditMode ? "Exit Column Edit" : "Edit mode"}</span>
        <kbd className="text-[10px] bg-neutral-100 border border-neutral-200 px-1.5 py-0.5 rounded text-neutral-500 font-mono">
          Ctrl + E
        </kbd>
      </Button>
    </div>
  );
}