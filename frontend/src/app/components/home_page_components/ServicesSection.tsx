import React from "react";
import  CardForHome  from "../card_component/CardForHome";
import { LiaMedalSolid } from "react-icons/lia";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
export const ServicesSection = () => {
  return (
    <section className="w-full min-h-100 bg-gradient-to-t from-teal-100 to-white pb-10">
      <div className="flex flex-col items-center mt-10 gap-10">
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="font-sans font-bold text-3xl ">
            {" "}
            Our Specialized Services
          </h1>
          <p className="text-gray-500 text-md px-5 sm:text-lg md:text-xl md:w-170">
            Comprehensive physiotherapy treatments tailored to your specific
            needs and recovery goals
          </p>
        </div>
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 lg:gap-15">
          <CardForHome title='Sports Injury Rehabilitation' description="Specialized treatment for sports-related injuries and performance enhancement." icon={<LiaMedalSolid/>}/>
          <CardForHome title='Back Pain Treatment' description="Comprehensive care for chronic and acute back pain conditions." icon={<MdOutlinePeopleOutline />}/>
          <CardForHome title='Post-Surgery Recovery' description="Guided rehabilitation programs for optimal post-surgical healing." icon={<IoMdTime />}/>
        </div>
      </div>
    </section>
  );
};
