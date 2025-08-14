import React from "react";

export const TodayAppointmentPage = ({
  activeTab,
  todaysAppointments,
  getStatusColor,
  openBilling,
  updateAppointmentStatus
}) => {
  const Clock = () => <span>⏰</span>;
  const Phone = () => <span>📞</span>;
  const Mail = () => <span>📧</span>;
  return (
    <div>
      {activeTab === "appointments" && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-black">
            Today&apos;s Appointments
          </h2>

          <div className="grid gap-4">
            {todaysAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => openBilling(appointment)}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {appointment.patientName}
                      </button>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{appointment.time}</span>
                        <span>•</span>
                        <span>{appointment.type}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{appointment.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{appointment.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={appointment.status}
                      onChange={(e) =>
                        updateAppointmentStatus(appointment.id, e.target.value)
                      }
                      className="p-2 border rounded text-sm"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="No-show">No-show</option>
                    </select>
                    <button
                      onClick={() => openBilling(appointment)}
                      className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                    >
                      Bill
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
