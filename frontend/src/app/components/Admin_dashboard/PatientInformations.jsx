import React, { useState, useEffect, useMemo } from "react";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";

export const PatientInformations = ({ activeTab }) => {
  const Search = () => <span>🔍</span>;
  const [allPatients, setAllPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState("all"); // 'all', 'booked', 'completed', 'requested'

  useEffect(() => {
    const fetchAndProcessAppointments = async () => {
      if (activeTab !== "patients") return;

      setIsLoading(true);
      try {
        const response = await Axios({
          url: summaryApi.getAllAppointments.endpoint,
          method: summaryApi.getAllAppointments.method,
        });

        if (response.data && Array.isArray(response.data)) {
          const appointments = response.data;
          console.log("app", appointments);
          // Process appointments to get patient-centric data
          const patientData = appointments.reduce((acc, appointment) => {
            const patientId = appointment.patient_id;
            if (!acc[patientId]) {
              // Sort appointments by date to easily find the latest one
              const sortedAppointments =
                appointment.appointments &&
                Array.isArray(appointment.appointments)
                  ? [...appointment.appointments].sort(
                      (a, b) =>
                        new Date(b.appointmentDate) -
                        new Date(a.appointmentDate)
                    )
                  : [];
              acc[patientId] = {
                ...appointment,
                appointments: sortedAppointments,
              };
            }

            return acc;
          }, {});

          const patientList = Object.values(patientData);
          setAllPatients(patientList);
        } else {
          setAllPatients([]);
        }
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
        setAllPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessAppointments();
  }, [activeTab]);

  const filteredPatients = useMemo(() => {
    if (activeFilterTab === "all") {
      return allPatients;
    }
    return allPatients.filter((patient) =>
      patient.appointments.some((apt) => apt.status === activeFilterTab)
    );
  }, [allPatients, activeFilterTab]);

  const TabButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium capitalize ${
        isActive
          ? "border-b-2 border-blue-600 text-blue-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {activeTab === "patients" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Patient Records</h2>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="flex border-b border-gray-200">
              <TabButton
                label="All"
                isActive={activeFilterTab === "all"}
                onClick={() => setActiveFilterTab("all")}
              />
              <TabButton
                label="Booked"
                isActive={activeFilterTab === "booked"}
                onClick={() => setActiveFilterTab("booked")}
              />
              <TabButton
                label="Completed"
                isActive={activeFilterTab === "completed"}
                onClick={() => setActiveFilterTab("completed")}
              />
              <TabButton
                label="Requested"
                isActive={activeFilterTab === "requested"}
                onClick={() => setActiveFilterTab("requested")}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Last Visit
                    </th>
                   
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-500"
                      >
                        Loading patient records...
                      </td>
                    </tr>
                  </tbody>
                ) : filteredPatients.length === 0 ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-500"
                      >
                        No patient records found for this filter.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => {
                      const lastAppointment = patient.appointments?.[0];
                      return (
                        <tr key={patient.patient_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900 capitalize">
                              {patient.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{patient.phone_number}</div>
                            <div>{patient.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lastAppointment
                              ? new Date(lastAppointment.appointmentDate)
                                  .toISOString()
                                  .split("T")[0]
                              : "N/A"}
                          </td>
                         
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900">
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
