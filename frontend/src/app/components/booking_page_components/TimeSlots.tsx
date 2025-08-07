"use client";
import { GoDotFill } from "react-icons/go";
import React, { useContext, useState } from "react";
import { IoIosTimer } from "react-icons/io";
import { AppContext } from "@/app/context/AppContext";
import { DenotingUserStyle } from "./DenotingUserStyle";

export const TimeSlots = () => {
  const slots = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
 
  const [bookedSlots, setBookedSlots] = useState<string[]>(["13:00", "15:00"]);



  const {dateClicked , selectedDate, handleScrollToForm} = useContext(AppContext)

  
  return dateClicked === false ?(
    <section className="w-full flex font-sans justify-center items-center mb-8">
      <div className=" w-[70%] bg-gradient-to-t from-teal-100 to-white p-3 rounded-2xl h-70 shadow-xl">
        <p className="flex items-center text-2xl gap-1">
            <IoIosTimer className="font-bold" /> Available Time Slots
        </p>
        <div className="capitalize text-gray-600 mt-5 p-2 max-w-80 flex flex-col gap-5">

        <p >please select a date to view available timeslots</p>
        <div className="flex flex-row gap-5">
          <DenotingUserStyle color="bg-green-500" text="available"/>
          <DenotingUserStyle color="bg-red-500" text="booked"/>
        </div>
        </div>
        </div>
    </section>
  ):(
    (
    <section className="w-full flex mb-8 font-sans justify-center items-center  ">
      <div className=" w-[70%] bg-gradient-to-t from-teal-100 to-white p-3 shadow-xl rounded-2xl">
        <div>
          <p className="flex items-center text-2xl gap-1">
            <IoIosTimer className="font-bold" /> Available Time Slots
          </p>
          <p className="text-gray-500 text-sm mt-3">Selected Date: {selectedDate}</p>
          <section className="grid grid-cols-3 mt-5 gap-3">
            {slots?.map((slot,index) => {
              const booked = bookedSlots.includes(slot)
              return (
                <button
                  key={index}
                  className={`shadow-2xl text-center rounded py-2 ${booked ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-teal-700 cursor-pointer text-white"}`}
                  onClick={() => !booked && handleScrollToForm(slot)}
                  disabled={booked}
                >
                 
                    {
                    booked ? <p className="flex items-center justify-center">{slot} <span className=" opacity-50 text-red-600 "><GoDotFill /></span></p> : <p>{slot}</p>
                  }
                  
                </button>
              );
            })}
          </section>
           <div className="flex flex-row gap-5 mt-5">
          <DenotingUserStyle color="bg-green-500" text="available"/>
          <DenotingUserStyle color="bg-red-500" text="booked"/>
        </div>
        </div>
      </div>
    </section>
  )
  )
};

