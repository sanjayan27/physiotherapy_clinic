import summaryApi from "@/app/common/summary.api";
import { AppContext } from "@/app/context/AppContext";
import Axios from "@/app/utils/Axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckToSlot } from "react-icons/fa6";
export const TodayAppointmentPage = ({
  activeTab,
  getStatusColor,
  openBilling,
}) => {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toggleUpdateDiv, setToggleUpdateDiv] = useState(null);
  const [paymentValue, setPaymentValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });


  const Clock = () => <span>⏰</span>;
  const Phone = () => <span>📞</span>;
  const Mail = () => <span>📧</span>;

  const fetchAppointmentsByDate = async (date) => {
    setIsLoading(true);
    try {
      const response = await Axios({
        url: summaryApi.getAdminAppointments.endpoint,
        method: summaryApi.getAdminAppointments.method,
        params: { date }, // Pass date as a query parameter, e.g., ?date=YYYY-MM-DD
      });
      console.log("resss", response.data);
      if (response.data && Array.isArray(response.data)) {
        setTodaysAppointments(response.data);
      } else {
        setTodaysAppointments([]);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setTodaysAppointments([]); // Reset on error
    } finally {
      setIsLoading(false);
    }
  };
  function formatDateToPostgres(date) {
    const pad = (num, size = 2) => String(num).padStart(size, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // months are 0-indexed
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (selectedDate) {
      fetchAppointmentsByDate(formatDateToPostgres(new Date(selectedDate)));
    }
  }, [selectedDate]);
  const toggleUpdatePaymentDiv = (id) => {
    setToggleUpdateDiv(toggleUpdateDiv === id ? null : id);
  };

  const handleUpdatePaymentAndStatus = async (appointmentId) => {
    if (isSubmitting) return;

    const payload = {};
    if (paymentValue) payload.payment = paymentValue;
    if (statusValue) payload.status = statusValue;

    if (Object.keys(payload).length === 0) {
      toast.error("Please select a payment or status value to update.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await Axios({
        url: `${summaryApi.updatePatientPayment.endpoint}/${appointmentId}`,
        method: summaryApi.updatePatientPayment.method,
        data: payload,
      });
      toast.success(
        response.data.message || "Appointment updated successfully!"
      );
      fetchAppointmentsByDate(formatDateToPostgres(new Date(selectedDate)));
      setToggleUpdateDiv(null);
      setPaymentValue("");
      setStatusValue("");
    } catch (err) {
      console.error("Failed to update appointment:", err);
      toast.error(
        err.response?.data?.message || "Failed to update appointment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {activeTab === "appointments" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black">Appointments</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded text-sm bg-white"
            />
          </div>
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Loading appointments...
            </div>
          ) : todaysAppointments.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No appointments are scheduled for today.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.appointment_id}>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => openBilling(appointment)}
                            className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer capitalize"
                          >
                            {appointment.patient.name}
                          </button>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium  capitalize ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>

                          <div className="uppercase bg-amber-300 rounded-2xl py-1 px-2 text-sm">
                            {appointment.payment}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center gap-1">
                              <FaCheckToSlot />
                              <p>Slot : {appointment.slot.slot}</p>
                            </div>
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(
                                appointment.appointmentDate
                              ).toDateString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            <span>•</span>
                            <span className="font-medium text-blue-500">
                              Concern :{" "}
                              <span className="text-black">
                                {appointment.concerns}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>
                                +91 {appointment.patient.phone_number}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span>{appointment.patient.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2  gap-3 flex-col-reverse">
                        <button
                          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                          onClick={() =>
                            toggleUpdatePaymentDiv(appointment.appointment_id)
                          }
                        >
                          Update Payment & Status
                        </button>
                        <button
                          onClick={() => openBilling(appointment)}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                        >
                          Update Bill
                        </button>
                      </div>
                    </div>
                  </div>
                  {toggleUpdateDiv === appointment.appointment_id ? (
                    <div>
                      <form
                        className="flex gap-5 mx-auto p-4 bg-gray-100 rounded-b-lg items-center "
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleUpdatePaymentAndStatus(
                            appointment.appointment_id
                          );
                        }}
                      >
                        <div className="flex flex-row gap-5">
                          <label htmlFor="">Update Payment</label>
                          <select
                            name=""
                            id=""
                            className="border rounded-sm"
                            value={paymentValue}
                            onChange={(e) => setPaymentValue(e.target.value)}
                          >
                            <option value="">Select Payment</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                          </select>
                          <div>
                            <label htmlFor="">Update Status</label>
                            <select
                              name=""
                              id=""
                              className="border rounded-sm"
                              value={statusValue}
                              onChange={(e) => setStatusValue(e.target.value)}
                            >
                              <option value="">Select Status</option>
                              <option value="completed">Completed</option>
                              <option value="in-progress">In Progress</option>
                              <option value="approved">Approved</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
                        >
                          {isSubmitting ? "Updating..." : "Update"}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
