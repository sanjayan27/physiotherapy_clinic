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

// Example: DD/MM/YYYY
export const UserInfo = ({ userDetails }: any) => {
  const date = new Date(userDetails.bdDate);
  const formatted = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return (
    <section className="">
      <div className="flex items-center font-sans justify-between">
        <div className="hidden md:flex flex-col gap-2">
          <h1 className="text-xl font-semibold  capitalize">
            {userDetails.name}
          </h1>
          <h1 className="text-gray-600">
            Patient ID:{" "}
            <span className="bg-green-100 text-black rounded-xl py-1  px-2">
              {userDetails.id}
            </span>
          </h1>
        </div>
        <div className="me-5 hidden md:block cursor-pointer hover:bg-gray-200 transition-all duration-200 p-2 rounded">
          <FiEdit3 />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-5">
        <PersonalData name={userDetails.email} icon={<MdOutlineMail />} />
        <PersonalData
          name={userDetails.phoneNumber}
          icon={<MdOutlinePhone />}
        />
        <PersonalData name={formatted} icon={<FaRegCalendarAlt />} />
        <PersonalData
          name={userDetails.location}
          icon={<IoLocationOutline />}
        />
      </div>
    </section>
  );
};
