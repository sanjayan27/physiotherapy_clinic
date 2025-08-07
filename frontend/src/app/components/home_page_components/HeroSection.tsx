"use client";
import Button from "./Button";
import { FaRegCalendar } from "react-icons/fa";
import { CiPhone } from "react-icons/ci";
import Carousel from "./Carousel"

export default function HeroSection() {
  return (
    <section className="relative w-full h-90 md:h-120 lg:h-130 overflow-hidden">
      {/* Gradient Overlay: Increased transparency to show more image */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black-900/70 via-green-800/60  to-black/50">
      <div className="flex flex-col justify-center  gap-2 items-center w-full h-full text-white">
        <h1 className="text-4xl w-[80vw]  lg:text-6xl font-bold text-center font-sans">
        Professional Physiotherapy Care
        </h1>
        <p className="text-center text-lg lg:text-2xl w-[75%]">
        Expert treatment for pain relief, injury recovery, and wellness
        enhancement
        </p>
        <div className="flex gap-3 items-center">
        <Button
          name_button="Book Appointment"
          icon={<FaRegCalendar />}
          border=" border border-teal-600"
          background="bg-teal-600"
          hover="hover:bg-green-700 hover:border-green-700"
          text_color="white"
          navigation="/book-appointment"
        />
        <Button
          name_button="Call now"
          icon={<CiPhone />}
          border="border"
          background="bg-transparent"
          hover="hover:bg-white"
          text_color="hover:text-green-600"
          navigation="contact"
        />
        </div>
      </div>
      </div>
      {/* Carousel Images */}
      <Carousel />
    </section>
  );
}