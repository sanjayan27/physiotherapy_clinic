import React, { useContext, useState } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Upload,
  Heart,
  Sparkles,
} from "lucide-react";
import { AppContext } from "@/app/context/AppContext";

export default function PatientInformationForm({ existingUser }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    concerns: "",
    additionalNotes: "",
    uploadedFile: null,
  });
  
  const { formRefForScroll } = useContext(AppContext);
  const [selectedDate] = useState("March 15, 2024");
  const [selectedSlots] = useState("10:30 AM - 11:00 AM");
  const [focusedField, setFocusedField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, uploadedFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Thank you for booking your appointment! We will contact you soon.");
    setIsSubmitting(false);
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
                    type="number"
                    required
                    placeholder="+91 00000 00000"
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
            {!existingUser && <div>
              {formData.concerns === "Other" ? (
              <div className="mb-6 space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Upload className="w-4 h-4" />
                  Upload Medical Documents
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                    formData.uploadedFile
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <div className="text-center">
                    <Upload
                      className={`mx-auto h-12 w-12 ${
                        formData.uploadedFile
                          ? "text-teal-500"
                          : "text-gray-400"
                      }`}
                    />
                    <p className="mt-2 text-sm text-gray-600">
                      {formData.uploadedFile
                        ? `Selected: ${formData.uploadedFile.name}`
                        : "Click to upload or drag and drop files here"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            ):(<div></div>)}
            </div>}

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
