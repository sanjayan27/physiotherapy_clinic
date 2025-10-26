"use client";
import { useState } from "react";
import { FiEdit3, FiSave } from "react-icons/fi";
import { MdOutlineMail, MdOutlinePhone, MdClose } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { PersonalData } from "./ui/PersonalData";
import Axios from "@/app/utils/Axios";
import summaryApi from "@/app/common/summary.api";
// Assuming toast is set up in the project
import { toast } from "react-toastify";
import { updateUserDetails } from "@/app/services/patientAppointmentBooking.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, InputAdornment } from "@mui/material";
import { Calendar } from "lucide-react";

export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bdDate: string; // ISO date string
  location: string;
}

interface UserInfoProps {
  userDetails: UserDetails;
  onUpdateSuccess: () => void;
}

export const UserInfo = ({ userDetails, onUpdateSuccess }: UserInfoProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getDisplayDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const getInputDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    name: userDetails.name || "",
    phoneNumber: userDetails.phoneNumber || "",
    bdDate: getInputDate(userDetails.bdDate),
    location: userDetails.location || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateUserDetails({
          ...formData,
          bdDate: formData.bdDate
            ? new Date(formData.bdDate).toISOString()
            : null,
        },
        userDetails.id
      )

      if (response) {
        toast.success("Details updated successfully!");
        setIsEditing(false);
        onUpdateSuccess();
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      toast.error("Failed to update details. Please try again.");
    }
  };

  if (isEditing) {
    return (
      <section className="">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center font-sans justify-between">
            <h1 className="text-xl font-semibold">Edit Personal Details</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label
                htmlFor="bdDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <DatePicker
                selected={formData.bdDate ? new Date(formData.bdDate) : null}
                onChange={(d: Date | null) => setFormData((prev) => ({ ...prev, bdDate: d ? d.toISOString().split("T")[0] : "" }))}
                dateFormat="yyyy-MM-dd"
                popperPlacement="bottom-start"
                popperModifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
                calendarClassName="rdp-calendar"
                popperClassName="rdp-popper"
                showPopperArrow={false}
                customInput={
                  <TextField
                    id="bdDate"
                    name="bdDate"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Calendar size={16} />
                        </InputAdornment>
                      ),
                    }}
                  /> as any
                }
                required
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location / Address
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <MdClose /> Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white global-bg-color hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <FiSave /> Save Changes
            </button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="">
      <div className="flex items-center font-sans justify-between ">
        <div className="hidden md:flex flex-col gap-2">
          <h1 className="text-xl font-semibold capitalize">
            {userDetails.name}
          </h1>
          <h1 className="text-gray-600">
            Patient ID:{" "}
            <span className="bg-green-100 text-black rounded-xl py-1 px-2">
              {userDetails.id}
            </span>
          </h1>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="me-5 hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all duration-200 p-2 rounded"
        >
          <FiEdit3 /> Edit
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <PersonalData name={userDetails.email} icon={<MdOutlineMail />} />
        <PersonalData
          name={userDetails.phoneNumber}
          icon={<MdOutlinePhone />}
        />
        <PersonalData
          name={getDisplayDate(userDetails.bdDate)}
          icon={<FaRegCalendarAlt />}
        />
        <PersonalData
          name={userDetails.location}
          icon={<IoLocationOutline />}
        />
      </div>
    </section>
  );
};
