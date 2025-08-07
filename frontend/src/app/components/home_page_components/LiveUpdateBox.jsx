"use client"

import React from "react";
import Images from "next/image"
import { Clock } from 'lucide-react';

export const LiveUpdateBox = ({time, statusIcon, content, doctor, note}) => {
    const times = new Date(time).toLocaleTimeString([], {
  hour: '2-digit',
  minute: '2-digit',
});

  return (
    <section className="w-full h-[200px] bg-teal-50 rounded-xl shadow-2xl">
      <section className="p-3">
        <div className="flex flex-row items-center gap-1 text-sm">
            <p ><Clock className="w-4"/></p>
            <p>{times}</p>
        </div>
        <div className="text-sm mt-2">
            <p className="flex flex-row items-center gap-1">Status : <Images src={statusIcon} alt="" className="w-4 h-4"/> {content} </p>
        </div>
        <div>
            <p>{note}</p>
        </div>
        <div></div>
      </section>
    </section>
  );
};
