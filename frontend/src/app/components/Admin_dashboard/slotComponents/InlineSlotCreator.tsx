import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, X, Check, AlertCircle } from "lucide-react";
import {
  createSlotAdmin,
  createSlotsBulk,
} from "@/app/services/slotApi.service";

// Type definitions
interface NewSlot {
  tempId: number;
  time: string;
  duration: string;
}

interface ExistingSlot {
  id: string;
  time: string;
  isBooked: boolean;
  patientName: string;
}

interface SlotErrors {
  [tempId: number]: string;
}

interface SlotPayload {
  date: string;
  slot: string;
}

interface BulkSlotPayload {
  slots: SlotPayload[];
}

interface BulkSlotResponse {
  slots: any[];
  message?: string;
}

interface InlineSlotCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onSlotsCreated: () => void;
  existingSlots: ExistingSlot[];
}

type DurationOption = "15" | "30" | "45" | "60";

export const InlineSlotCreator: React.FC<InlineSlotCreatorProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSlotsCreated,
  existingSlots,
}) => {
  const [newSlots, setNewSlots] = useState<NewSlot[]>([
    { tempId: Date.now(), time: "", duration: "30" },
  ]);
  const [errors, setErrors] = useState<SlotErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // Reset to initial state when drawer opens
      setNewSlots([{ tempId: Date.now(), time: "", duration: "30" }]);
      setErrors({});
    }
  }, [isOpen]);

  const addNewSlotField = (): void => {
    setNewSlots([
      ...newSlots,
      { tempId: Date.now(), time: "", duration: "30" },
    ]);
  };

  const removeSlotField = (tempId: number): void => {
    if (newSlots.length > 1) {
      setNewSlots(newSlots.filter((slot) => slot.tempId !== tempId));
      // Remove errors for this slot
      const newErrors = { ...errors };
      delete newErrors[tempId];
      setErrors(newErrors);
    }
  };

  const updateSlotField = (
    tempId: number,
    field: keyof NewSlot,
    value: string
  ): void => {
    setNewSlots(
      newSlots.map((slot) =>
        slot.tempId === tempId ? { ...slot, [field]: value } : slot
      )
    );
    // Clear error for this field when user makes changes
    if (errors[tempId]) {
      const newErrors = { ...errors };
      delete newErrors[tempId];
      setErrors(newErrors);
    }
  };

  const validateSlots = (): boolean => {
    const newErrors: SlotErrors = {};
    const timeSet = new Set<string>();

    newSlots.forEach((slot) => {
      if (!slot.time) {
        newErrors[slot.tempId] = "Time is required";
      } else {
        // Check for duplicates within the new slots
        if (timeSet.has(slot.time)) {
          newErrors[slot.tempId] = "Duplicate time in new slots";
        }
        // Check against existing slots
        const existingConflict = existingSlots.some(
          (s) => s.time === slot.time
        );
        if (existingConflict) {
          newErrors[slot.tempId] = "Slot already exists at this time";
        }
        timeSet.add(slot.time);
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSlots = async (): Promise<void> => {
    // Filter out slots with empty time
    const validSlots = newSlots.filter((slot) => slot.time);

    if (validSlots.length === 0) {
      toast.error("Please add at least one slot with a time");
      return;
    }

    if (!validateSlots()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: BulkSlotPayload = {
        slots: validSlots.map((slot) => ({
          date: selectedDate,
          slot: slot.time,
        })),
      };
      const response: BulkSlotResponse = await createSlotsBulk(payload);

      if (response.slots.length > 0) {
        toast.success(`${response.slots.length} slot(s) created successfully!`);
        onSlotsCreated(); // Refresh the slots list
        onClose();
      }
    } catch (error) {
      console.error("Error creating slots:", error);
      toast.error("Failed to create slots");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeChange = (tempId: number, value: string): void => {
    updateSlotField(tempId, "time", value);
  };

  const handleDurationChange = (tempId: number, value: string): void => {
    updateSlotField(tempId, "duration", value);
  };

  if (!isOpen) return null;

  return (
    <div className="mb-8 bg-white rounded-xl shadow-md border transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="bg-gray-50 p-4 flex items-center justify-between rounded-t-xl border-b">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Create Appointment Slots
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Add multiple slots for{" "}
            <span className="font-semibold">{selectedDate}</span>.
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          type="button"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      {/* Content */}
      <div className="p-6">
        <div>
          <div className="space-y-4">
            {newSlots.map((slot, index) => (
              <div
                key={slot.tempId}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-700">
                    Slot {index + 1}
                  </h3>
                  {newSlots.length > 1 && (
                    <button
                      onClick={() => removeSlotField(slot.tempId)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      type="button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-3 flex gap-10">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={slot.time}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleTimeChange(slot.tempId, e.target.value)
                        }
                        className={`w-[30vw] border-2 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500  ${
                          errors[slot.tempId]
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors[slot.tempId] && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {errors[slot.tempId]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <select
                      value={slot.duration}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleDurationChange(slot.tempId, e.target.value)
                      }
                      className="w-[30vw] border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addNewSlotField}
              className="w-full border-2 border-dashed border-teal-300 text-teal-600 py-3 rounded-lg hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 font-semibold"
              type="button"
            >
              <Plus className="w-5 h-5" />
              Add Another Slot
            </button>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-xl">
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSlots}
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            type="button"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Save Slots
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};