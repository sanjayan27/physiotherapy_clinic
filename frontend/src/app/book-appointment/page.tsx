"use client";

import MyCalendar from "../components/booking_page_components/Calender";
import { TimeSlots } from "../components/booking_page_components/TimeSlots";
import PatientInformationForm from "../components/booking_page_components/InputForm";
import { BorderLine } from "../components/BorderLine";
import { useState } from "react";
export default function page() {
  const [existingUser, setExistingUser] = useState(false);
  return (
    <section className="w-full min-h-screen bg-gradient-to-t from-teal-100 to-white py-10">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold w-full bg-gradient-to-r from-teal-500  to-teal-800 bg-clip-text text-transparent">
          Book Your Appointment
        </h1>
        <p className="text-gray-500 text-lg ">
          Start by telling us your concern, and we'll guide you through the
          rest.
        </p>
      </div>

      {/* Main booking container */}
        {existingUser && (
          <div className="mt-12">
            <BorderLine />
            <div className="text-center my-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Select a Date & Time
              </h2>
              <p className="text-gray-500">
                Choose an available slot that works for you.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 lg:gap-0 lg:grid-cols-2 place-items-center">
              <div className="flex justify-center">
                <MyCalendar />
              </div>
              <div className="w-full">
                <TimeSlots />
              </div>
            </div>
          </div>
        )}
      <div className="max-w-4xl mx-auto mt-10">
        <PatientInformationForm
          existingUser={existingUser}
          setExistingUser={setExistingUser}
        />

      </div>
    </section>
  );
}
