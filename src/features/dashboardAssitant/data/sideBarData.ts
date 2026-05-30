import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { QuickStateType } from "../types";

export const quickState: QuickStateType[] = [
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