"use client";

import MyCalendar from "../components/booking_page_components/Calender";
import { TimeSlots } from "../components/booking_page_components/TimeSlots";
import { InputForm } from "../components/booking_page_components/InputForm";
import { BorderLine } from "../components/BorderLine";
import { useState } from "react";
export default function page() {
  const [newUser,setNewUser] = useState<boolean>(true)
  return (
    <section className="w-[100vw]  bg-gradient-to-t from-teal-100 to-white">
      <div className="flex flex-col gap-2 text-center mt-5 ">
        <h1 className="text-2xl md:text-3xl font-bold w-full bg-gradient-to-r from-teal-500  to-teal-800 bg-clip-text text-transparent">
          Book Your Slots
        </h1>
        <p className="text-gray-500 text-lg ">
          Choose your preferred date and time for your appointment.
        </p>
      </div>

      
        {
          !newUser && <div>
          <div className="grid grid-cols-1  gap-10 lg:gap-0 my-10  lg:grid-cols-2 place-items-center ">
          <div className="flex  justify-center ">
            <MyCalendar />
          </div>
          <div className="w-full">
            <TimeSlots />
          </div>
          
        </div>
        <BorderLine />
        </div>
      
        }


      <div className="w-[100%] pb-15 mt-10">
        <InputForm />
      </div>
    </section>
  );
}
