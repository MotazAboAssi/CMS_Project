import  { cn } from "@/lib/utils";
import { Calendar, CheckCircle2, Clock, XCircle, type LucideProps } from "lucide-react";

interface QuickStateType {
  label: string;
  count: number;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  bg: string;
}

const quickState: QuickStateType[] = [
  {
    label: "Total appointments",
    count: 28,
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "Checked In",
    count: 12,
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    label: "No-shows",
    count: 2,
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    label: "Pending",
    count: 3,
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

export function QuickStateSection() {
  return (
    <div className="p-5 border-b border-[#DBDBDC]">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-3.5">
        Quick Stats:
      </h4>
      <div className="space-y-3">
        {quickState.map((stat, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs font-semibold"
          >
            <div className="flex items-center gap-2 text-neutral-500">
              <div
                className={cn(
                  "w-5 h-5 rounded-md flex items-center justify-center",
                  stat.bg,
                  stat.color,
                )}
              >
                <stat.icon className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span
                className={cn(
                  " font-bold px-2 py-0.5 rounded-full",
                  stat.color,
                )}
              >
                {stat.count}
              </span>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}