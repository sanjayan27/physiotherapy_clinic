"use client";

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/app/context/AppContext";
import ProfileImg from "@/app/assets/OIP.webp";
import { UserInfo, UserDetails } from "./UserInfo";
import { FiEdit3 } from "react-icons/fi";
import { AxiosToastError } from "@/app/utils/AxiosToastSended";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";

const UserProfileCard = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { userLogged, setUserId, userId } = useContext(AppContext);
  const handleUserDetails = async () => {
    try {
      const response = await Axios({
        url: summaryApi.getUserDetails.endpoint,
        method: summaryApi.getUserDetails.method,
        withCredentials: true,
      });
      if (response.data) {
        // TODO: Ensure patientId is part of the API response
        setUserId(response?.data?.id);
        setUserDetails({ ...response?.data });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    handleUserDetails();
  }, []);

  if (!userDetails) {
    return (
      <main className="rounded mx-4 shadow-md p-2 flex flex-col md:flex-row bg-gray-50 max-w-screen md:w-full animate-pulse">
        <div className="md:w-[10vw] flex md:justify-center gap-3 py-5">
          <div className="w-16 h-16 rounded-full bg-gray-300"></div>
        </div>
        <div className="overflow-hidden w-full py-4 px-2 space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="rounded  shadow-md  p-2  flex flex-col md:flex-row bg-gray-50 max-w-screen md:w-full">
      <figure className="md:w-[10vw]  flex md:justify-center gap-3 py-5">
        <img src={ProfileImg.src} alt="" className="w-15 h-15 rounded-full" />
        <div className="md:hidden flex justify-between w-full">
          <div className="flex  flex-col gap-2">
            <h1 className="text-xl font-semibold capitalize">
              {userDetails.name}
            </h1>
            <h1 className="text-gray-600">
              Patient ID:{" "}
              <span className="text-sm bg-green-100 text-black rounded-xl py-1 px-2">
                {userDetails.id}
              </span>
            </h1>
          </div>
          <div className="me-5 md:hidden cursor-pointer hover:bg-gray-200 transition-all duration-200 p-2 rounded">
            <FiEdit3 />
          </div>
        </div>
      </figure>

      <section className=" overflow-hidden w-full py-4  ">
        <UserInfo
          userDetails={userDetails}
          onUpdateSuccess={handleUserDetails}
        />
      </section>
    </main>
  );
};
export default UserProfileCard;
