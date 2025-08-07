"use client";

import React from "react";
import { LiveUpdateBox } from "@/app/components/home_page_components/LiveUpdateBox";
import { MdTimeline } from "react-icons/md";
import availablePng from "@/app/assets/pngIcons/check.png";
import closepng from "@/app/assets/pngIcons/close.png";
import rescheduledpng from "@/app/assets/pngIcons/reschedule.png";
import delayedpng from "@/app/assets/pngIcons/expired.png";

const LiveAppointment = () => {
  const dummyData = [
    {
      slotId: "slot_001",
      time: "2025-08-07T10:30:00",
      status: "available",
      doctor: "Dr. Meena",
      statusIcon: availablePng,
    },
    {
      slotId: "slot_002",
      time: "2025-08-07T10:45:00",
      status: "ongoing",
      doctor: "Dr. Arjun",
      patient: "Rahul",
      statusIcon: availablePng,
    },
    {
      slotId: "slot_003",
      time: "2025-08-07T11:00:00",
      status: "delayed",
      doctor: "Dr. Meena",
      expectedStartTime: "2025-08-07T11:10:00",
      note: "Doctor running late",
      statusIcon: delayedpng,
    },
    {
      slotId: "slot_004",
      time: "2025-08-07T11:15:00",
      status: "cancelled",
      doctor: "Dr. Ravi",
      note: "Doctor unavailable",
      statusIcon: closepng,
    },
    {
      slotId: "slot_005",
      time: "2025-08-07T11:30:00",
      status: "rescheduled",
      doctor: "Dr. Meena",
      rescheduledTo: "2025-08-07T12:00:00",
      note: "Rescheduled by admin",
      statusIcon: rescheduledpng,
    },
  ];

  return (
    <section className="w-full min-h-[50vh] flex justify-center items-center">
      <section className="flex flex-col w-screen p-5 ">
        <header className="text-center text-3xl font-sans font-bold mb-3">Live Appointmen Update</header>
        <main>
          <section className="grid grid-cols-3 gap-15 mt-5 items-center">
            {dummyData.map((slot) => (
              <LiveUpdateBox
                key={slot.slotId}
                content={slot.status}
                time={slot.time}
                statusIcon={slot.statusIcon}
                note={slot.note}
                updatedTime={slot.expectedStartTime || slot.rescheduledTo}
              />
            ))}
          </section>
        </main>
      </section>
    </section>
  );
};
export default LiveAppointment;
