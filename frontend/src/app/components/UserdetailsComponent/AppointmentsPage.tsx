// pages/appointments.tsx or app/appointments/page.tsx (depending on your Next.js version)
"use client";
import React, { useState, useEffect, useMemo, useContext } from "react";
import { FilterIcon } from "lucide-react";
import { AppointmentCard } from "./ui/AppointmentCard";
import { AppContext } from "@/app/context/AppContext";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import { isAxiosError } from "axios";

interface Appointment {
  id: string;
  type: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: "completed" | "requested" | "approved" | "booked" | "cancelled";
}

const AppointmentsPage: React.FC = () => {
  const { userId } = useContext(AppContext);
  const [rawAppointments, setRawAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "booked" | "completed" | "approved" | "requested"
  >("requested");

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await Axios({
          url: `${summaryApi.getAppointmentData.endpoint}${userId}`,
          method: summaryApi.getAppointmentData.method,
          withCredentials: true,
        });
        let fetchedAppointments = response.data;

        // Ensure it's always an array
        if (!Array.isArray(fetchedAppointments)) {
          fetchedAppointments = [fetchedAppointments];
        }

        setRawAppointments(fetchedAppointments);
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 404) {
          // API returns 404 when no appointments are found, treat as empty list.
          setRawAppointments([]);
        } else {
          console.error("Failed to fetch appointments:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const appointments = useMemo((): Appointment[] => {
    if (!Array.isArray(rawAppointments)) {
      return [];
    }
    return rawAppointments.map((apt: any) => {
      const aptDate = new Date(apt.appointmentDate);
      return {
        id: apt.appointment_id,
        type: apt.concerns,
        doctor: apt.patient?.name || "N/A", // TODO: API should provide doctor info
        specialty: "General", // TODO: API should provide doctor specialty
        date: aptDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: aptDate.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: "Clinic Location", // TODO: API should provide location
        notes: apt.additional_notes,
        status: apt.status,
      };
    });
  }, [rawAppointments]);
  const {
    upcomingAppointments,
    completedAppointments,
    requestedAppointments,
    approvedAppointments,
  } = useMemo(() => {
    return {
      upcomingAppointments: appointments.filter(
        (apt) => apt.status === "approved"
      ),
      completedAppointments: appointments.filter(
        (apt) => apt.status === "completed" || apt.status === "cancelled"
      ),
      requestedAppointments: appointments.filter(
        (apt) => apt.status === "booked"
      ),
      approvedAppointments: appointments.filter(
        (apt) => apt.status === "requested"
      ),
    };
  }, [appointments]);

  const getTabTitle = () => {
    switch (activeTab) {
      case "booked":
        return "Upcoming Appointments";
      case "requested":
        return "Submitted Appointments";
      case "approved":
        return "Approved Appointments";
      case "completed":
        return "Appointment History";
      default:
        return "Appointments";
    }
  };
  const renderAppointmentList = (list: Appointment[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="text-center py-12 text-gray-500">
          Loading appointments...
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">{emptyMessage}</div>
      );
    }
    return list.map((appointment) => (
      <AppointmentCard key={appointment.id} appointment={appointment} />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto p-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-4 mb-8 w-full">
          <button
            onClick={() => setActiveTab("requested")}
            className={`px-8 py-3 font-medium cursor-pointer rounded-t-lg transition-colors ${
              activeTab === "requested"
                ? " global-bg-color text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Boooked Appointments
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-8 py-3 font-medium cursor-pointer rounded-t-lg transition-colors ${
              activeTab === "approved"
                ? " global-bg-color text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Approved Appointments
          </button>
          <button
            onClick={() => setActiveTab("booked")}
            className={`px-8 py-3 font-medium cursor-pointer rounded-t-lg transition-colors ${
              activeTab === "booked"
                ? " global-bg-color text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Submitted Appointments
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-8 py-3 font-medium cursor-pointer rounded-t-lg transition-colors ${
              activeTab === "completed"
                ? " global-bg-color text-white"
                : "bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            Appointment History
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-lg rounded-tr-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getTabTitle()}
              </h1>
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <FilterIcon className="w-5 h-5" />
                Filter
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "booked" && (
              <div>
                {renderAppointmentList(
                  upcomingAppointments,
                  "No upcoming appointments."
                )}
              </div>
            )}
            {activeTab === "approved" && (
              <div>
                {renderAppointmentList(
                  approvedAppointments,
                  "No approved appointments."
                )}
              </div>
            )}
            {activeTab === "requested" && (
              <div>
                {renderAppointmentList(
                  requestedAppointments,
                  "No submitted appointments awaiting approval."
                )}
              </div>
            )}

            {activeTab === "completed" && (
              <div>
                {renderAppointmentList(
                  completedAppointments,
                  "No appointment history."
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
