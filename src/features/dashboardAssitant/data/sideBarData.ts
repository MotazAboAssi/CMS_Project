import { Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { PendingRequest, QuickStateType } from "../types";
import { usePendingRequest } from "../hooks/usePendingRequest";
import { useDragHandlers } from "../components/SchedualeGrid/DNDGrid/hooks/useDragHandlers";

export const QuickState: () => QuickStateType[] = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const requests = usePendingRequest((state) => state.requests);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { doctors } = useDragHandlers();
  const countAppointments = doctors.reduce<number>((acc, doc) => {
    return acc + doc.appointments.length;
  }, 0);
  return [
    {
      label: "Total appointments",
      count: countAppointments,
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
      count: requests.length,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];
};

export const INITIAL_REQUESTS: PendingRequest[] = [
  {
    id: "req-1",
    patientName: "Folan Alfolani 1",
    doctorName: "Dr. Folan Alfolani",
    date: "5/5/2026",
    time: "2:00 PM",
    timeAgo: "1 d ago",
  },
  {
    id: "req-2",
    patientName: "Khalid Mansour",
    doctorName: "Dr. Alaa Al-Mansour",
    date: "6/5/2026",
    time: "3:30 PM",
    timeAgo: "2 d ago",
  },
  {
    id: "req-3",
    patientName: "Sarah Ahmed",
    doctorName: "Dr. Tariq Al-Hassan",
    date: "7/5/2026",
    time: "11:00 AM",
    timeAgo: "3 d ago",
  },
  {
    id: "req-4",
    patientName: "Yasmin Amari",
    doctorName: "Dr. Yasmin Amari",
    date: "8/5/2026",
    time: "1:15 PM",
    timeAgo: "4 d ago",
  },
];
