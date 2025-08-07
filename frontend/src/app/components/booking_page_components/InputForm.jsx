"use client";

import React, { useContext, useEffect, useState } from "react";
import { User, Phone, Mail } from "lucide-react";
import { MdOutlinePhone, MdOutlineEmail } from "react-icons/md";
import { AppContext } from "@/app/context/AppContext";

export const InputForm = () => {
  const { formRefForScroll, selectedSlots, selectedDate } =
    useContext(AppContext);

    const [fullName, setFullName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState('')
    const [concerns, setConcerns] = useState('')
    const [additionalNotes, setAdditionalNotes] = useState('')
    



  const handleSubmit = async (e) => {
    e.preventDefault();

    alert("thank you for booking your slot");
  };

  return (
    <section
      ref={formRefForScroll}
      className="w-[75%] font-sans mx-auto min-h-100  rounded-xl shadow-xl border-[1.5px] border-gray-400 "
    >
      <div className=" p-5">
        <div className="flex md:items-center gap-2 md:gap-0 flex-col md:flex-row md:justify-between">
          <p className="flex gap-1 font-bold text-teal-600">
            <User />
            <span className="text-2xl text-gray-600 ">Patient Information</span>
          </p>
          {selectedDate && selectedSlots && (
            <p className="text-gray-500 text-sm">
              Selected Slot ( {selectedDate} , {selectedSlots} )
            </p>
          )}
        </div>
        <form className="mt-5 " onSubmit={handleSubmit}>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 ">
            {/* FULL NAME INPUT FIELD */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-700  text-sm">
                Full Name <span className="text-orange-400">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Enter your full name"
                className="border rounded p-2 outline-none bg-transparent border-gray-400 "
                value={fullName} 
                onChange={(e)=>setFullName(e.target.value)}
              />
            </div>

            {/* DATE INPUT FIELD  */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-700  text-sm">Date: </label>
              <input
                type="text"
                value={selectedDate ? selectedDate : ""}
                placeholder="select the date from calender"
                disabled
                className="border rounded p-2 outline-none bg-transparent border-gray-400 "
                
              />
            </div>

            {/* PHONE NUMBER FIELD  */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 flex items-center gap-1 text-sm">
                <MdOutlinePhone />
                Phone Number <span className="text-orange-400">*</span>
              </label>
              <div
                className="bg-transparent 
                 border-gray-400 border rounded flex flex-row justify-between "
              >
                <input
                  type="number"
                  required
                  placeholder="+91 00000 00000"
                  className=" outline-none p-2 bg-transparent 
                 border-gray-400 [appearance:textfield] 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
             value={phoneNumber} 
                onChange={(e)=>setPhoneNumber(e.target.value)}
                />
                <button className=" cursor-pointer text-sm  p-2 md:text-xs md:px-1 lg-p-2 rounded bg-teal-600 text-white  border-teal-700">
                  Send OTP
                </button>
              </div>
            </div>

            {/* OTP FIELD  */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 flex items-center gap-1 text-sm">
                OTP <span className="text-orange-400">*</span>
              </label>
              <div
                className="bg-transparent 
                 border-gray-400 border rounded flex flex-row justify-between  "
              >
                <input
                  type="number"
                  placeholder="0 0 0 0 0 0"
                  className=" p-2 outline-none w-30 [appearance:textfield] 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button className=" p-2 border border-teal-600 text-sm rounded bg-teal-600 text-white cursor-pointer">
                  Verify
                </button>
              </div>
            </div>

            {/* EMAIL FIELD  */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-700 flex items-center gap-1 text-sm">
                <MdOutlineEmail />
                Email:
              </label>
              <input
                type="text"
                placeholder="your.email@gmail.com"
                className="border rounded p-2 outline-none bg-transparent border-gray-400  "
                value={email} 
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>

            {/* CONCERNS FIELD  */}

            <div className="flex flex-col gap-2">
              <label htmlFor="condition" className="text-gray-700  text-sm">
                Select your condition / concerns{" "}
                <span className="text-orange-400">*</span>
              </label>
              <select
                id="condition"
                required
                className="border rounded p-2 py-[10px] outline-none bg-transparent border-gray-400  "
                name="condition"
                value={concerns} 
                onChange={(e)=>setConcerns(e.target.value)}
              >
                <option value="">Select your condition</option>
                <option>Back Pain</option>
                <option>Neck Pain</option>
                <option>Knee Injury</option>
                <option>Sports Injury</option>
                <option>Post-Surgery Recovery</option>
                <option>Arthritis</option>
                <option>Shoulder Pain</option>
                <option>Headaches</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* ADDITIONAL NOTES FIELD  */}

          <div className="mt-5 flex flex-col gap-2">
            <label className="text-gray-700 text-sm">
              {" "}
              Additional Notes <span>(optional)</span>{" "}
            </label>
            <textarea
              type="text"
              className="border w-full rounded p-1 outline-none border-gray-400 "
              placeholder="Enter your additional notes here"
              value={additionalNotes} 
                onChange={(e)=>setAdditionalNotes(e.target.value)}
            />
          </div>

          {/* SUBMITION FIELD  */}

          <button className="w-full bg-teal-600 p-2 rounded-lg  cursor-pointer text-white mt-7">
            Confirm Appointment
          </button>
        </form>
      </div>
    </section>
  );
};
