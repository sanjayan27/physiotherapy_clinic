"use client";
import { FiEdit3 } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PersonalData } from "./ui/PersonalData";

interface UserInfoDetails {
  stats: {
    patientName: string;
    patientId: string;
  };
}
const state = {
  email: "sarajohnson@gmail.com",
  number: "+91 9243553295",
  dob: "30-08-2012",
  location: "chennai",
};

export const UserInfo = ({ stats }: UserInfoDetails) => {
  return (
    <section className="">
      <div className="flex items-center font-sans justify-between">
        <div className="hidden md:flex flex-col gap-2">
          <h1 className="text-xl font-semibold  capitalize">{stats.patientName}</h1>
          <h1 className="text-gray-600">
            Patient ID:{" "}
            <span className="bg-green-100 text-black rounded-xl py-1  px-2">
              {stats.patientId}
            </span>
          </h1>
        </div>
        <div className="me-5 hidden md:block cursor-pointer hover:bg-gray-200 transition-all duration-200 p-2 rounded">
          <FiEdit3 />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <PersonalData name={state.number} icon={<MdOutlineMail />} />
        <PersonalData name={state.email} icon={<MdOutlinePhone />} />
        <PersonalData name={state.dob} icon={<FaRegCalendarAlt />} />
        <PersonalData name={state.location} icon={<IoLocationOutline />} />
      </div>
    </section>
  );
};
