import React, { useState } from "react";

export const CalenderSection = ({
  activeTab,
  availableSlots,
  setAvailableSlots,
  generateNextSixMonths,
  removeTimeSlot,
  addTimeSlot 
}) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const Trash2 = () => <span>🗑️</span>;
  return (
    <div>
      {activeTab === "calendar" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-black font-semibold">
              Doctor Available Slots
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4 text-gray-600">
                Select Date
              </h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                max={
                  new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-4  text-gray-600">
                Available Slots for {selectedDate}
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(availableSlots[selectedDate] || []).map((time) => (
                  <div
                    key={time}
                    className="flex items-center justify-between bg-green-100 text-green-700 px-3 py-2 rounded"
                  >
                    <span>{time}</span>
                    <button
                      onClick={() => removeTimeSlot(selectedDate, time)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {(!availableSlots[selectedDate] ||
                availableSlots[selectedDate].length === 0) && (
                <p className="text-gray-600 text-center py-4">
                  No slots available for this date
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4 text-gray-600">
              Quick Slot Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border rounded-lg  text-gray-600"
              >
                {generateNextSixMonths().map((month) => (
                  <optgroup
                    key={month.value}
                    label={`${month.month} ${month.year}`}
                  >
                    {Array.from({ length: 31 }, (_, i) => {
                      const day = i + 1;
                      const date = `${month.value}-${String(day).padStart(
                        2,
                        "0"
                      )}`;
                      const dateObj = new Date(date);
                      if (
                        dateObj.getMonth() !==
                        parseInt(month.value.split("-")[1]) - 1
                      )
                        return null;
                      return (
                        <option key={date} value={date}>
                          {dateObj.toLocaleDateString()}
                        </option>
                      );
                    }).filter(Boolean)}
                  </optgroup>
                ))}
              </select>

              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addTimeSlot(selectedDate, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="p-2 border rounded-lg"
              >
                <option value="">Add Time Slot</option>
                {[
                  "09:00",
                  "09:30",
                  "10:00",
                  "10:30",
                  "11:00",
                  "11:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                  "16:00",
                  "16:30",
                  "17:00",
                  "17:30",
                ].map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const commonSlots = [
                    "09:00",
                    "10:00",
                    "11:00",
                    "14:00",
                    "15:00",
                    "16:00",
                  ];
                  setAvailableSlots((prev) => ({
                    ...prev,
                    [selectedDate]: [
                      ...new Set([
                        ...(prev[selectedDate] || []),
                        ...commonSlots,
                      ]),
                    ].sort(),
                  }));
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Default Slots
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
