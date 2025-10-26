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
  TableOfContents,
} from "lucide-react";
import {
  createSlotAdmin,
  deleteSlotAdmin,
  getSlotForSingleDate,
  getUpcomingSlots,
  updateSlotAdmin,
} from "@/app/services/slotApi.service";
import { getAdminAppointments } from "@/app/services/adminAppointment.service";
import { SlotModal } from "./SlotModal";
import { InlineSlotCreator } from "./InlineSlotCreator";
import { TableofSlots } from "./TableofSlots";

// Type definitions
interface Slot {
  id: string;
  slot: string;
  time: string;
  isBooked: boolean;
  patientName: string;
  date: string;
}

interface Patient {
  name: string;
  id?: string;
}

interface SlotInfo {
  slot: string;
}

interface Appointment {
  slot?: SlotInfo;
  status: string;
  patient?: Patient;
}

interface DefaultSlot {
  time: string;
}

interface SlotData {
  date: string;
  time: string;
}

interface CalenderSectionProps {
  activeTab: string;
}

type ModalMode = "edit" | "delete" | "create";
type FilterStatus = "all" | "available" | "booked";
type SlotAction = "edit" | "delete";

export const CalenderSection: React.FC<CalenderSectionProps> = ({
  activeTab,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCreatingSlots, setIsCreatingSlots] = useState<boolean>(false);
  const [showSlotModal, setShowSlotModal] = useState<boolean>(false);
  const [showCreateSlotForm, setShowCreateSlotForm] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("edit");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const fetchAllUpcomingSlots = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = (await getUpcomingSlots()) as Slot[];
      if (response && Array.isArray(response)) {
        setSlots(response);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch upcoming slots.");
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSlotsAndAppointments = async (date: string): Promise<void> => {
    if (!date) return;
    setIsLoading(true);
    try {
      const slotsResponse = await getSlotForSingleDate(date);
      const fetchedSlots: Slot[] = Array.isArray(slotsResponse)
        ? slotsResponse
        : [];

      const appointmentsResponse = await getAdminAppointments(date);
      const appointments: Appointment[] = Array.isArray(appointmentsResponse)
        ? appointmentsResponse
        : [];

      const appointmentsBySlot: Record<string, string> = appointments?.reduce(
        (acc, app) => {
          if (app.slot?.slot && app.status !== "cancelled") {
            acc[app.slot.slot] = app?.patient?.name || "";
          }
          return acc;
        },
        {} as Record<string, string>
      );

      const combinedSlots: Slot[] = fetchedSlots
        .map((slot) => ({
          ...slot,
          time: slot.slot,
          isBooked: slot.isBooked,
          patientName: appointmentsBySlot[slot.slot] || "",
        }))
        .sort((a, b) => a.time.localeCompare(b.time));
      setSlots(combinedSlots);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        setSlots([]);
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
      if (selectedDate) {
        fetchSlotsAndAppointments(selectedDate);
      } else {
        fetchAllUpcomingSlots();
      }
    }
  }, [selectedDate, activeTab]);

  const openSlotModal = (mode: ModalMode, slot: Slot | null = null): void => {
    setModalMode(mode);
    setSelectedSlot(slot);
    setShowSlotModal(true);
  };

  const closeSlotModal = (): void => {
    setShowSlotModal(false);
    setSelectedSlot(null);
  };

  const handleSlotAction = async (
    action: SlotAction,
    slotData: SlotData
  ): Promise<void> => {
    setIsSubmitting(true);
    try {
      let response: any;
      switch (action) {
        case "edit":
          if (!selectedSlot?.id) throw new Error("No slot selected");
          response = await updateSlotAdmin(selectedSlot.id, {
            date: slotData.date,
            slot: slotData.time,
          });
          toast.success(response.message || "Slot updated successfully!");
          break;
        case "delete":
          if (!selectedSlot?.id) throw new Error("No slot selected");
          response = await deleteSlotAdmin(selectedSlot.id);
          toast.success(response.message || "Slot deleted successfully!");
          break;
        default:
          throw new Error("Invalid slot action");
      }
      if (selectedDate) {
        fetchSlotsAndAppointments(selectedDate);
      } else {
        fetchAllUpcomingSlots();
      }
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

  // const addDefaultSlots = async (): Promise<void> => {
  //   const defaultSlots: DefaultSlot[] = [
  //     { time: "09:00" },
  //     { time: "10:00" },
  //     { time: "11:00" },
  //     { time: "14:00" },
  //     { time: "15:00" },
  //   ];
  //   const existingTimes: string[] = slots.map((slot) => slot.time);
  //   const slotsToAdd: DefaultSlot[] = defaultSlots.filter(
  //     (slot) => !existingTimes.includes(slot.time)
  //   );

  //   if (slotsToAdd.length === 0) {
  //     toast.success("All default slots already exist for this date!");
  //     return;
  //   }

  //   const payloadSlots: string[] = slotsToAdd.map((s) => s.time);

  //   setIsSubmitting(true);
  //   try {
  //     const response = await Axios.post(summaryApi.createSlotAdmin.endpoint, {
  //       date: selectedDate,
  //       slots: payloadSlots,
  //     });
  //     toast.success(
  //       response.data.message || `Added ${payloadSlots.length} default slots!`
  //     );
  //     fetchSlotsAndAppointments(selectedDate);
  //   } catch (error) {
  //     console.error("Error adding default slots:", error);
  //     const message = isAxiosError(error)
  //       ? error.response?.data?.message
  //       : "An unexpected error occurred.";
  //     toast.error(message || "Failed to add default slots.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const filteredSlots: Slot[] = useMemo(
    () =>
      slots.filter((slot) => {
        const matchesSearch =
          (slot.patientName &&
            slot.patientName
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          slot.slot.includes(searchTerm);
        const matchesFilter =
          filterStatus === "all" ||
          (filterStatus === "available" && !slot.isBooked) ||
          (filterStatus === "booked" && slot.isBooked);
        return matchesSearch && matchesFilter;
      }),
    [slots, searchTerm, filterStatus]
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    if (!newDate) {
      setSearchTerm(""); // Clear search when clearing date
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setFilterStatus(e.target.value as FilterStatus);
  };

  return (
    <div className="bg-slate-50 p-6">
      {activeTab === "calendar" && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-teal-600 via-green-600 to-black rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Calendar />
                  Doctor Available Slots
                </h1>
                <p className="opacity-90 mt-1">
                  {selectedDate
                    ? `Showing slots for ${selectedDate}`
                    : "Showing all upcoming slots"}
                  Manage your clinic's appointment schedule
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowCreateSlotForm((prev) => !prev)}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Slot
                </button>
                <button
                  // onClick={addDefaultSlots}
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
                  value={selectedDate || ""}
                  onChange={handleDateChange}
                  className="border-2 border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>
              <div className="flex items-center gap-2 flex-grow">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={
                    selectedDate
                      ? "Search by time or patient..."
                      : "Search by time..."
                  }
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border-2 border-gray-200 rounded-lg px-3 py-1.5 w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  className="border-2 border-gray-200 rounded-lg px-3 py-1.5"
                >
                  <option value="all">All Slots</option>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Inline Slot Creator */}
          <InlineSlotCreator
            isOpen={showCreateSlotForm}
            onClose={() => setShowCreateSlotForm(false)}
            selectedDate={selectedDate}
            onSlotsCreated={() => fetchSlotsAndAppointments(selectedDate)}
            existingSlots={slots}
          />

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
                  {selectedDate
                    ? `Create a slot for ${selectedDate} or adjust your filters.`
                    : "No upcoming slots found. Try creating one!"}
                </p>
                <button
                  onClick={() => setShowCreateSlotForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create First Slot
                </button>
              </div>
            </div>
          ) : (
            <TableofSlots
              openSlotModal={openSlotModal}
              filteredSlots={filteredSlots}
            />
          )}

          {/* Modal for Edit/Delete */}
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
