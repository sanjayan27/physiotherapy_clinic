import HeroSection from "./components/home_page_components/HeroSection";
import ClinicSection from "./components/home_page_components/ClinicSection";
import GetInTouch from "./components/home_page_components/GetInTouch";
import { ServicesSection } from "./components/home_page_components/ServicesSection";
import StatisticsSection from "./components/home_page_components/StatisticsSection";

import AppointmentStatus from "@/app/components/home_page_components/LiveAppointment.";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <AppointmentStatus />
      <ServicesSection />
      <StatisticsSection/>
      <ClinicSection />
      <GetInTouch />

    </div>
  );
}
