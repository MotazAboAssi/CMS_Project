import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Download } from "lucide-react";

export function RightSection() {
  return (
    <div className="flex items-center gap-4">
      <Button className="h-9.5 bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold rounded-xl px-4 flex items-center gap-1.5 shadow-sm">
        <Download className="w-3.5 h-3.5" />
        <span>Download schedule</span>
      </Button>

      <button className="w-9.5 h-9.5 rounded-xl border border-neutral-200 flex items-center justify-center relative hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer">
        <Bell className="w-4 h-4" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>

      <Avatar className="w-9.5 h-9.5 rounded-xl border border-neutral-200">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback className="rounded-xl font-bold bg-[#0066ff] text-white text-xs">
          SC
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
