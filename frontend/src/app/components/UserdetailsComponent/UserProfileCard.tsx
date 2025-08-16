"use client";

import React, { useContext } from "react";
import { AppContext } from "@/app/context/AppContext";
import ProfileImg from "@/app/assets/OIP.webp";
import { UserInfo } from "./UserInfo";
import { FiEdit3 } from "react-icons/fi";

const UserProfileCard = () => {
  const stats = {
    patientName: "Sarah Johnson",
    patientId: "PAT-2024-001",
  };

  const { userLogged } = useContext(AppContext);

  return (
    <main className="rounded mx-4 shadow-md  p-2  flex flex-col md:flex-row bg-gray-50 max-w-screen md:w-full">
      <figure className="md:w-[10vw]  flex md:justify-center gap-3 py-5">
        <img src={ProfileImg.src} alt="" className="w-15 h-15 rounded-full" />
        <div className="md:hidden flex justify-between w-full">
          <div className="flex  flex-col gap-2">
          <h1 className="text-xl font-semibold  capitalize">
            {stats.patientName}
          </h1>
          <h1 className="text-gray-600">
            Patient ID:{" "}
            <span className="text-md bg-green-100 text-black rounded-xl py-1  px-2">
              {stats.patientId}
            </span>
          </h1>
        </div>
        <div className="me-5 md:hidden cursor-pointer hover:bg-gray-200 transition-all duration-200 p-2 rounded">
          <FiEdit3 />
        </div>
        </div>
      </figure>

      <section className=" overflow-hidden w-full py-4 px-2 ">
        <UserInfo stats={stats} />
      </section>
    </main>
  );
};
export default UserProfileCard;
