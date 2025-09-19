import React, { useState, useEffect } from "react";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";

export const PatientInformations = ({ activeTab }) => {
  const Search = () => <span>🔍</span>;
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          console.log('app',appointments)
          // Process appointments to get patient-centric data
          const patientData = appointments.reduce((acc, appointment) => {
            const patientId = appointment.patient_id;
            if (!acc[patientId]) {
              acc[patientId] = {
                ...appointment,
                lastVisit: new Date(0), // Start with epoch time
                concern: "",
              };
            }

            
            return acc;
          }, {});

          const patientList = Object.values(patientData);
          setPatients(patientList);
        } else {
          setPatients([]);
        }
      } catch (err) {
        console.error("Failed to fetch patient data:", err);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessAppointments();
  }, [activeTab]);

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

          <div className="bg-white rounded-lg shadow overflow-hidden ">
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
                    Last Concern
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      Loading patient records...
                    </td>
                  </tr>
                </tbody>
              ) : patients.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                      No patient records found.
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
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
                        {patient.lastVisit.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.appointments[0]?.concerns}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
