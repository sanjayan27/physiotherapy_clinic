"use client";

import { AppContext } from "@/app/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function Calender() {
  const [selected, setSelected] = useState<Date>();

  const { setDateClicked, setSelectedDate, selectedDate } =
    useContext(AppContext);

  // const fetchDateForTimeslots = async()=>{
  //   const data = await fetch.get(`/api/data/${selected}`,)
  // }
  const dateToFetch = selected ? new Date(selected) : new Date();
  const year = dateToFetch.getFullYear();
  const month = String(dateToFetch.getMonth() + 1).padStart(2, "0");
  const day = String(dateToFetch.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  useEffect(() => {
    if (selected) {
      setSelectedDate(formattedDate);
      setDateClicked(true);
    }
  }, [selected]);

  return (
    <section className="  p-3 rounded-xl shadow-xl bg-teal-50">
      <DayPicker
        animate
        mode="single"
        selected={selected}
        onSelect={setSelected}
        disabled={[{ before: new Date() }]}
        modifiersClassNames={{
          disabled: "opacity-50 ",
        }}
        classNames={{
          nav_button:
            "text-teal-500 hover:text-teal-700 text-lg p-2 rounded-full hover:bg-teal-100",
        }}
      />
    </section>
  );
}
