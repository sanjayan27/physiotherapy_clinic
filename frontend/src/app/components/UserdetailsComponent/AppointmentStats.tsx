"use client";
import { useContext, useEffect, useMemo, useState } from "react";
import { Card } from "./CardForStats";
import { AppContext } from "@/app/context/AppContext";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import { isAxiosError } from "axios";

interface Appointment {
  id: string;
  status: "booked" | "approved" | "completed" | "cancelled";
  // Add other properties from your API response as needed
}

export const AppointmentStats = () => {
  const { userLogged, setUserId, userId } = useContext(AppContext);

  const [appointmentData, setAppointmentData] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const stats = useMemo(() => {
    // Ensure appointmentData is an array before calling .filter on it.
    if (!Array.isArray(appointmentData)) {
      return { total: 0, upcoming: 0, completed: 0, cancelled: 0 };
    }
    return {
      total: appointmentData?.length,
      upcoming: appointmentData?.filter(
        (apt: Appointment) =>
          apt.status === "booked" || apt.status === "approved"
      ).length,
      completed: appointmentData?.filter(
        (apt: Appointment) => apt.status === "completed"
      ).length,
      cancelled: appointmentData?.filter(
        (apt: Appointment) => apt.status === "cancelled"
      ).length,
    };
  }, [appointmentData]);

  const fetchAppointmentData = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({
        url: `${summaryApi.getAppointmentData.endpoint}${userId}`,
        method: summaryApi.getAppointmentData.method,
        withCredentials: true,
      });
      if (response.data) {
        let fetchedAppointments = response?.data;
        
        // Ensure it's always an array
        if (!Array?.isArray(fetchedAppointments)) {
          fetchedAppointments = [fetchedAppointments];
        }

        setAppointmentData(fetchedAppointments);
      }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 404) {
        // API returns 404 when no appointments are found, treat as empty list.
        setAppointmentData([]);
      } else {
        console.error("Failed to fetch appointment data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchAppointmentData();
    } else {
      setIsLoading(false);
    }
  }, [userId]);

  if (isLoading) {
    // You can replace this with a proper skeleton loader component
    return <div className="px-4 my-8">Loading statistics...</div>;
  }

  return (
    <section>
      <Card stats={stats} />
    </section>
  );
};
