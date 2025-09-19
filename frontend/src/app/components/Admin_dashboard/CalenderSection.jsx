import React, { useState, useEffect, useMemo } from "react";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

const SlotModal = ({
  isOpen,
  onClose,
  mode,
  slot,
  onSubmit,
  selectedDate,
  existingSlots,
}) => {
  const [formData, setFormData] = useState({
    time: slot?.time || "09:00",
    date: selectedDate,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "create") {
      setFormData({ time: "09:00", date: selectedDate });
    } else if (slot) {
      setFormData({
        time: slot.time,
      });
    }
    setErrors({});
  }, [isOpen, mode, slot]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.date)
      newErrors.date = "Date is required in the format of yyyy-mm-dd";

    if (
      mode === "create" ||
      (mode === "edit" && formData.time !== slot?.time)
    ) {
      const timeConflict = existingSlots.some(
        (s) => s.time === formData.time && s.id !== slot?.id
      );
      if (timeConflict) {
        newErrors.time = "A slot already exists at this time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(mode, formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div
          className={`p-6 text-white rounded-t-2xl ${
            mode === "delete"
              ? "bg-gradient-to-r from-red-500 to-red-600"
              : "bg-gradient-to-r from-blue-500 to-purple-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              {mode === "create" && (
                <>
                  <Plus /> Create New Slot
                </>
              )}
              {mode === "edit" && (
                <>
                  <Edit /> Edit Slot
                </>
              )}
              {mode === "delete" && (
                <>
                  <Trash2 /> Delete Slot
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full"
            >
              <X />
            </button>
          </div>
        </div>

        {mode === "delete" ? (
          <div className="p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-lg text-gray-800">
                Delete slot at <span className="font-bold">{slot?.time}</span>?
              </p>
              <p className="text-gray-600 text-sm">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => onSubmit("delete")}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Time Slot
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className={`w-full p-3 border-2 rounded-lg ${
                  errors.time ? "border-red-400" : "border-gray-200"
                }`}
                required
              />
              {errors.time && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.time}
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Date
              </label>
              <input
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: e.target.value,
                  })
                }
                className={`w-full p-3 border-2 rounded-lg ${
                  errors.date ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.date}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <Check />
                {mode === "create" ? "Create Slot" : "Update Slot"}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CalenderSection = ({ activeTab }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchSlotsAndAppointments = async (date) => {
    if (!date) return;
    setIsLoading(true);
    try {
      // Fetch all slots (available and booked)
      const slotsResponse = await Axios.get(
        summaryApi.getSlotForSingleDate.endpoint,
        { params: { date } }
      );
      const fetchedSlots = Array.isArray(slotsResponse?.data)
        ? slotsResponse.data
        : [];

      // Fetch appointments to get patient names for booked slots
      const appointmentsResponse = await Axios.get(
        summaryApi.getAdminAppointments.endpoint,
        { params: { date } }
      );
      const appointments = Array.isArray(appointmentsResponse?.data)
        ? appointmentsResponse?.data
        : [];

      const appointmentsBySlot = appointments?.reduce((acc, app) => {
        // Assuming slot number is stored in app.slot or can be derived from time
        if (app.slot?.slot) {
          acc[app.slot.slot] = app?.patient?.name;
        }
        return acc;
      }, {});

      const combinedSlots = fetchedSlots
        .map((slot) => ({
          ...slot,
          time: slot.slot, // The API returns `slot`, but the UI components use `time`.
          isBooked: !!appointmentsBySlot[slot.slot],
          patientName: appointmentsBySlot[slot.slot] || "",
        }))
        .sort((a, b) => a.time.localeCompare(b.time));

      setSlots(combinedSlots);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        setSlots([]); // No slots found for this date, which is not an error.
      } else {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch schedule data.");
        setSlots([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "calendar") {
      fetchSlotsAndAppointments(selectedDate);
    }
  }, [selectedDate, activeTab]);

  const openSlotModal = (mode, slot = null) => {
    setModalMode(mode);
    setSelectedSlot(slot);
    setShowSlotModal(true);
  };

  const closeSlotModal = () => {
    setShowSlotModal(false);
    setSelectedSlot(null);
  };
  console.log("id", selectedSlot);

  const handleSlotAction = async (action, slotData) => {
    console.log('slotdata',slotData)
    setIsSubmitting(true);
    try {
      let response;
      switch (action) {
        case "create":
          response = await Axios({
          url:  summaryApi.createSlotAdmin.endpoint,
          method: summaryApi.createSlotAdmin.method,
          data: {
            date: slotData.date,
            slot: slotData.time
          }
      });
          toast.success(response.data.message || "Slot created successfully!");
          break;
        case "edit":
          // Assuming an update endpoint exists
          response = await Axios({
            url: `${summaryApi.updateSlotAdmin.endpoint}/${selectedSlot.id}`,
            method: summaryApi.updateSlotAdmin.method,
            data: {
              date: slotData.date,
              slot: slotData.slot,
            },
          });
          console.log("response", response);
          toast.success(response.data.message || "Slot updated successfully!");
          break;
        case "delete":
          response = await Axios.delete(
            `${summaryApi.deleteSlotAdmin.endpoint}/${selectedSlot.id}`
          );
          toast.success(response.data.message || "Slot deleted successfully!");
          break;
        default:
          throw new Error("Invalid slot action");
      }
      fetchSlotsAndAppointments(selectedDate); // Re-fetch to get the latest state
    } catch (error) {
      console.error(`Error during slot ${action}:`, error);
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : "An unexpected error occurred.";
      toast.error(message || `Failed to ${action} slot.`);
    } finally {
      setIsSubmitting(false);
      closeSlotModal();
    }
  };

  const addDefaultSlots = async () => {
    const defaultSlots = [
      { time: "09:00" },
      { time: "10:00" },
      { time: "11:00" },
      { time: "14:00" },
      { time: "15:00" },
    ];
    const existingTimes = slots.map((slot) => slot.time);
    const slotsToAdd = defaultSlots.filter(
      (slot) => !existingTimes.includes(slot.time)
    );

    if (slotsToAdd.length === 0) {
      toast.success("All default slots already exist for this date!");
      return;
    }

    const payloadSlots = slotsToAdd.map((s) => s.time);

    setIsSubmitting(true);
    try {
      // Assuming backend handles bulk creation with a `slots` array property
      const response = await Axios.post(summaryApi.createSlotAdmin.endpoint, {
        date: selectedDate,
        slots: payloadSlots,
      });
      toast.success(
        response.data.message || `Added ${payloadSlots.length} default slots!`
      );
      fetchSlotsAndAppointments(selectedDate);
    } catch (error) {
      console.error("Error adding default slots:", error);
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : "An unexpected error occurred.";
      toast.error(message || "Failed to add default slots.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSlots = useMemo(
    () =>
      slots.filter((slot) => {
        const matchesSearch =
          slot.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slot.time.includes(searchTerm);
        const matchesFilter =
          filterStatus === "all" ||
          (filterStatus === "available" && !slot.isBooked) ||
          (filterStatus === "booked" && slot.isBooked);
        return matchesSearch && matchesFilter;
      }),
    [slots, searchTerm, filterStatus]
  );

  return (
    <div className=" bg-slate-50 p-6">
      {activeTab === "calendar" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Calendar />
                  Doctor Available Slots
                </h1>
                <p className="opacity-90">
                  Manage your clinic's appointment schedule
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openSlotModal("create")}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Slot
                </button>
                <button
                  onClick={addDefaultSlots}
                  disabled={isSubmitting}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Default Slots"}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <label className="font-semibold text-gray-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>
              <div className="flex items-center gap-2 flex-grow">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by time or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-1.5 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-1.5"
                >
                  <option value="all">All Slots</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Loading schedule...
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  No slots found
                </h3>
                <p className="text-gray-600 mb-6">
                  Create a slot for {selectedDate} or adjust your filters.
                </p>
                <button
                  onClick={() => openSlotModal("create")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create First Slot
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all border-l-4 ${
                    slot.isBooked ? "border-red-400" : "border-green-400"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          slot.isBooked ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        <Clock
                          className={`w-5 h-5 ${
                            slot.isBooked ? "text-red-600" : "text-green-600"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-gray-800">
                          {slot.time}
                        </div>
                        <div className="text-xs text-gray-600">
                          {slot.date} min
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        slot.isBooked
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {slot.isBooked ? "Booked" : "Available"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openSlotModal("edit", slot)}
                      disabled={slot.isBooked}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-md font-semibold flex items-center justify-center gap-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => openSlotModal("delete", slot)}
                      disabled={slot.isBooked}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-md font-semibold flex items-center justify-center gap-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <SlotModal
            isOpen={showSlotModal}
            onClose={closeSlotModal}
            mode={modalMode}
            slot={selectedSlot}
            onSubmit={handleSlotAction}
            existingSlots={slots}
            selectedDate={selectedDate}
          />
        </div>
      )}
    </div>
  );
};
