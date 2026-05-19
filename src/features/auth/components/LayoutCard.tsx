import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export default function LayoutCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between w-full h-full p-6 sm:p-10 lg:p-6 bg-white rounded-4xl z-10 transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 mb-6 lg:mb-0 select-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg text-[#0066ff]">
          <PlusIcon className="w-5 h-5 stroke-3" />
        </div>
        <span className="font-sans font-bold tracking-tight text-lg text-neutral-900 leading-tight">
          Project name
        </span>
      </div>

      {children}

      <div className="hidden lg:block h-2" />
    </div>
  );
}
