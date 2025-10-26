import React, { useState, useEffect } from "react";
import { Edit, Trash2, X, Check, AlertCircle } from "lucide-react";

// Type definitions
interface Slot {
  id: string;
  time: string;
  date: string;
  isBooked: boolean;
  patientName: string;
}

interface FormData {
  time: string;
  date: string;
}

interface FormErrors {
  time?: string;
  date?: string;
}

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: any;
  slot: any;
  onSubmit: any;
  selectedDate: string;
  existingSlots: any;
}

export const SlotModal: React.FC<SlotModalProps> = ({
  isOpen,
  onClose,
  mode,
  slot,
  onSubmit,
  selectedDate,
  existingSlots,
}) => {
  const [formData, setFormData] = useState<FormData>({
    time: slot?.time || "09:00",
    date: selectedDate,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (mode === "edit" && slot) {
      setFormData({
        time: slot.time,
        date: slot.date.split("T")[0],
      });
    }
    setErrors({});
  }, [isOpen, mode, slot]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required in the format of yyyy-mm-dd";
    }

    if (mode === "edit" && formData.time !== slot?.time) {
      const timeConflict = existingSlots.some(
        (s:any) => s.time === formData.time && s.id !== slot?.id
      );
      if (timeConflict) {
        newErrors.time = "A slot already exists at this time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (validateForm()) {
      onSubmit(mode, formData);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, time: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, date: e.target.value });
  };

  const handleDeleteSubmit = (): void => {
    onSubmit("delete");
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
              {mode === "edit" && (
                <>
                  <Edit className="w-5 h-5" /> Edit Slot
                </>
              )}
              {mode === "delete" && (
                <>
                  <Trash2 className="w-5 h-5" /> Delete Slot
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-full"
              type="button"
            >
              <X className="w-5 h-5" />
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
                onClick={handleDeleteSubmit}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
                type="button"
              >
                <Trash2 className="w-5 h-5" />
                Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold"
                type="button"
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
                onChange={handleTimeChange}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                type="date"
                value={formData.date || ""}
                onChange={handleDateChange}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-colors"
                type="button"
              >
                <Check className="w-5 h-5" />
                Update Slot
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                type="button"
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