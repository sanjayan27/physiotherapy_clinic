"use client";

import { AppContext } from "@/app/context/AppContext";
import { useContext, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function Calender() {
  const [selected, setSelected] = useState<Date>();

  const { setDateClicked, setSelectedDate, selectedDate } =
    useContext(AppContext);
  console.log(selectedDate);

  // const fetchDateForTimeslots = async()=>{
  //   const data = await fetch.get(`/api/data/${selected}`,)
  // }

  useEffect(() => {
    if (selected) {
      setSelectedDate(selected.toLocaleDateString());
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
