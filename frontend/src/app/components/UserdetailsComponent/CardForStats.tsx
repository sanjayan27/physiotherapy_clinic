"use client";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

interface AppointmentStatsProps {
  stats: {
    total: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
}

export const Card = ({ stats }: AppointmentStatsProps) => {
  const statItems = [
    {
      label: "Total Appointments",
      value: stats.total,
      icon: Calendar,
      color: "text-medical-primary",
      bgColor: "bg-medical-primary/10",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      color: "text-medical-info",
      bgColor: "bg-medical-info/10",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-medical-success",
      bgColor: "bg-medical-success/10",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];
  return (
    <div className="grid gap-5 grid-cols-2 md:grid-cols-4 px-4 my-8">
      {statItems?.map((item, index) => (
        <div
          key={index}
          className="flex bg-gradient-to-l from-gray-50 to-white rounded-lg p-4 shadow items-center gap-3"
        >
          <p
            className={`${
              item.label === "Completed"
                ? "bg-green-200 global-text-color-teal"
                : item.label === "Cancelled"
                ? "bg-red-100 text-red-500"
                : "bg-gray-200 global-text-color-teal"
            } p-2 rounded-lg `}
          >
            {<item.icon />}{" "}
          </p>
          <div className="">
            <p>{item.value}</p>
            <p>{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
