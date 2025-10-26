import { Clock, Edit, Trash2 } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
import { Pagination, Stack } from "@mui/material";
import { Slot } from "./types";

interface TableOfSlotsProps {
  openSlotModal: (mode: "edit" | "delete", slot: Slot) => void;
  filteredSlots: Slot[];
}

export const TableofSlots: React.FC<TableOfSlotsProps> = ({
  openSlotModal,
  filteredSlots,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 10;

  // Calculate indexes
  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot);

  // Total pages
  const totalPages = Math.ceil(filteredSlots.length / slotsPerPage);

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
      <table className="w-full table">
        <thead className="bg-gray-100 border-1 border-gray-400 ">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              S/No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Slot
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>

            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>
        {currentSlots &&
          currentSlots.map((slot, index) => (
            <tbody key={index} className="border-1 border-gray-300">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 capitalize">
                    {indexOfFirstSlot + index + 1}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 capitalize">
                    {slot.slot}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>{new Date(slot.date).toLocaleDateString()}</div>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 ${
                    slot.isBooked ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {slot.isBooked ? "Booked" : "Available"}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                </td>
              </tr>
            </tbody>
          ))}
      </table>
      {totalPages > 1 && (
        <Stack spacing={2} alignItems="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </div>
  );
};
