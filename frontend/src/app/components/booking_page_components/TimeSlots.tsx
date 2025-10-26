"use client";
import { GoDotFill } from "react-icons/go";
import React, { useContext, useEffect, useState } from "react";
import { IoIosTimer } from "react-icons/io";
import { AppContext } from "@/app/context/AppContext";
import { DenotingUserStyle } from "./DenotingUserStyle";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import { getSlotForSingleDate } from "@/app/services/slotApi.service";

export const TimeSlots = () => {
  const [singleDaySlots, setSingleDaySlots] = useState<object[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { dateClicked, selectedDate, handleScrollToForm ,selectedSlots,setSelectedSlots} =
    useContext(AppContext)!;

  const fetchSlotsByDate = async (date?: string) => {
    setIsLoading(true);
    if(!date){
      return 'Choose the <date></date>'
    }
    try {
      const response = await getSlotForSingleDate(date)
      // Assuming the API returns an object like { success: true, data: [...] }
      if (response && Array.isArray(response)) {
        setSingleDaySlots(response);
      } else {
        setSingleDaySlots([]);
      }
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setSingleDaySlots([]); // Reset on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    fetchSlotsByDate(selectedDate || undefined);
  }, [selectedDate]);

 

  return dateClicked === false ? (
    <section className="w-full flex font-sans justify-center items-center mb-8">
      <div className=" w-[80%] sm:w-[75%] bg-brand-soft p-3 rounded-2xl h-70 shadow-xl">
        <p className="flex items-center text-2xl gap-1">
          <IoIosTimer className="font-bold" /> Available Time Slots
        </p>
        <div className="capitalize text-body mt-5 p-2 max-w-80 flex flex-col gap-5">
          <p>please select a date to view available timeslots</p>
          <div className="flex flex-row gap-5">
            <DenotingUserStyle color="bg-green-500" text="available" />
            <DenotingUserStyle color="bg-red-500" text="booked" />
          </div>
        </div>
      </div>
    </section>
  ) : (
    <section className="w-full flex mb-8 font-sans justify-center items-center  ">
      <div className=" w-[70%] bg-brand-soft p-3 shadow-xl rounded-2xl">
        <div>
          <p className="flex items-center text-2xl gap-1">
            <IoIosTimer className="font-bold" /> Available Time Slots
          </p>
          <p className="text-body text-sm mt-3">
            Selected Date: {selectedDate}
          </p>
          <section className="grid grid-cols-3 mt-5 gap-3">
            {isLoading ? (
              <p className="col-span-3 text-center text-body">
                Loading slots...
              </p>
            ) : singleDaySlots.length > 0 ? (
              singleDaySlots.map((slot: any, index) => {
                // Assuming slot object has { time: "12:00", isBooked: false }
                const isBooked = slot.isBooked;
                return (
                  <button
                    key={index}
                    className={`shadow-2xl text-center rounded py-2 ${
                      isBooked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "global-bg-color cursor-pointer text-white"
                    }`}
                    onClick={() => !isBooked && handleScrollToForm(slot.slot) && setSelectedSlots(slot.slot)}
                    disabled={isBooked}
                  >
                    {isBooked ? (
                      <p className="flex items-center justify-center">
                        {slot.slot}{" "}
                        <span className=" opacity-50 text-red-600 ">
                          <GoDotFill />
                        </span>
                      </p>
                    ) : ( 
                      <p >{slot.slot}</p>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No slots available for this date.
              </p>
            )}
          </section>
          <div className="flex flex-row gap-5 mt-5">
            <DenotingUserStyle color="bg-green-500" text="available" />
            <DenotingUserStyle color="bg-red-500" text="booked" />
          </div>
        </div>
      </div>
    </section>
  );
};
