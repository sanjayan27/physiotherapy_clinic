import React, { useContext, useEffect, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Plus,
  FileText,
  Upload,
  Heart,
  Sparkles,
} from "lucide-react";
import { AppContext } from "@/app/context/AppContext";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
import {
  AxiosToastSuccess,
  AxiosToastError,
} from "@/app/utils/AxiosToastSended";
import toast from "react-hot-toast";
import { redirect } from "next/navigation";

const initialFormData = {
  fullName: "",
  phoneNumber: "",
  email: "",
  concerns: "",
  additionalNotes: "",
  documents: [{ file: null, note: "" }],
};

export default function PatientInformationForm({
  existingUser,
  setExistingUser,
}) {
  const [formData, setFormData] = useState(initialFormData);

  const { formRefForScroll, selectedDate, selectedSlots} = useContext(AppContext);
  const [focusedField, setFocusedField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...formData.documents];
    newDocuments[index][field] = value;
    setFormData((prev) => ({ ...prev, documents: newDocuments }));
  };

  const addDocumentField = () => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, { file: null, note: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!existingUser && formData.concerns === "Other") {
      const hasAtLeastOneFile = formData.documents.some((doc) => doc.file);
      if (!hasAtLeastOneFile) {
        alert("Please upload at least one medical document.");
        return;
      }

      const fileWithEmptyNote = formData.documents.find(
        (doc) => doc.file && !doc.note
      );
      if (fileWithEmptyNote) {
        alert("Please provide a note for each uploaded document.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.fullName);
      payload.append("phone_number", formData.phoneNumber);
      payload.append("email", formData.email);
      payload.append("concerns", formData.concerns);
      payload.append("additional_notes", formData.additionalNotes);
      payload.append("appointmentDate", selectedDate);
      payload.append("appointmentSlot", selectedSlots); // TODO: This is hardcoded, make it dynamic

      // Append documents if they exist and are for a new user
      if (!existingUser && formData.concerns === "Other") {
        formData.documents.forEach((doc) => {
          if (doc.file && doc.note) {
            payload.append(`document_files`, doc.file);
            payload.append(`document_notes`, doc.note);
          }
        });
      } 

      const response = await Axios({
        url: summaryApi.bookAppointment.endpoint,
        method: summaryApi.bookAppointment.method,
        data: payload,
        withCredentials: true,
      });
      if (response.data.success) {
        alert("Successfully booked your appointment")// Use the helper function
        setFormData(initialFormData);
      } else {
        AxiosToastError({
          data: {
            message:
              response.data.message ||
              "There was an issue booking your appointment. Please try again.",
          },
        }); // Use the helper function
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      AxiosToastError({
        data: {
          message:
            error.response?.data?.message ||
            "An error occurred while booking your appointment. Please try again later.",
        },
      }); // Use the helper function
    } finally {
      setIsSubmitting(false);
    }
  };
  const checkUser = async () => {
    // This logic determines if the user is "existing" for the purpose of showing the calendar.
    // If a concern is selected and it's not "Other", we show the calendar.
    // Otherwise (no concern, or "Other"), we hide it.
    if (formData.concerns && formData.concerns !== "Other") {
      setExistingUser(true);
    } else {
      setExistingUser(false);
    }
  };

  const conditionOptions = [
    "Back Pain",
    "Neck Pain",
    "Knee Injury",
    "Sports Injury",
    "Post-Surgery Recovery",
    "Arthritis",
    "Shoulder Pain",
    "Headaches",
    "Other",
  ];
  useEffect(() => {
    checkUser();
  }, [formData.concerns]);
  return (
    <div
      ref={formRefForScroll}
      className="min-h-screen  p-4 flex items-center justify-center flex-col font-sans"
    >
      <div className="w-full  mx-auto">
        {/* Main Form Container */}
        <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Selected Slot Banner */}
          {existingUser && selectedDate && selectedSlots && (
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-center gap-3 text-white">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  Selected Appointment: {selectedDate} at {selectedSlots}
                </span>
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          )}

          {/* Form Header */}
          <div className="px-8 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-xl">
                <User className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Patient Information
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                      focusedField === "fullName"
                        ? "border-teal-500 shadow-lg shadow-teal-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="00000 00000"
                    maxLength={10}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                      focusedField === "phone"
                        ? "border-teal-500 shadow-lg shadow-teal-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
                      focusedField === "email"
                        ? "border-teal-500 shadow-lg shadow-teal-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField("")}
                  />
                </div>
              </div>

              {/* Concerns */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Heart className="w-4 h-4" />
                  Medical Concerns <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer ${
                      focusedField === "concerns"
                        ? "border-teal-500 shadow-lg shadow-teal-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    value={formData.concerns}
                    onChange={(e) =>
                      handleInputChange("concerns", e.target.value)
                    }
                    onFocus={() => setFocusedField("concerns")}
                    onBlur={() => setFocusedField("")}
                  >
                    <option value="">Select your condition</option>
                    {conditionOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload */}
            {!existingUser && formData.concerns === "Other" && (
              <div className="mb-6 space-y-4">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Upload className="w-4 h-4" />
                    Upload Medical Documents{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addDocumentField}
                    className="p-1.5 bg-teal-100 text-teal-600 rounded-full hover:bg-teal-200 transition-colors"
                    aria-label="Add another document"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {formData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-xl bg-white/60 space-y-3"
                  >
                    {/* File input */}
                    <div
                      className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-300 ${
                        doc.file
                          ? "border-teal-500 bg-teal-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="file"
                        onChange={(e) =>
                          handleDocumentChange(index, "file", e.target.files[0])
                        }
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                      <div className="text-center">
                        <Upload
                          className={`mx-auto h-10 w-10 ${
                            doc.file ? "text-teal-500" : "text-gray-400"
                          }`}
                        />
                        <p className="mt-2 text-sm text-gray-600">
                          {doc.file
                            ? `Selected: ${doc.file.name}`
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Document Note */}
                    <div className="space-y-1">
                      <label
                        htmlFor={`doc-note-${index}`}
                        className="text-xs font-medium text-gray-600"
                      >
                        Note for this document{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        id={`doc-note-${index}`}
                        type="text"
                        placeholder="e.g., X-ray from last month"
                        value={doc.note}
                        onChange={(e) =>
                          handleDocumentChange(index, "note", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm border-gray-200 hover:border-gray-300 focus:border-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Notes */}
            <div className="mb-8 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                Additional Notes{" "}
                <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Please share any additional information about your condition or specific requirements..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none ${
                  focusedField === "notes"
                    ? "border-teal-500 shadow-lg shadow-teal-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                onFocus={() => setFocusedField("notes")}
                onBlur={() => setFocusedField("")}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={(e) => handleSubmit(e)}
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Your Request...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Confirm Your Appointment
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>
          Your information is secure and protected. We respect your privacy.
        </p>
      </div>
    </div>
  );
}
