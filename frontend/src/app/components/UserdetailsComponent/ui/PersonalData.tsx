"use client";

export const PersonalData = ({ icon, name }: any) => {
  return (
  <div className="flex items-center gap-2  ">
    <p className="global-text-color-teal text-xl">{icon}</p>
    <p className="text-gray-600">{name}</p>
  </div>
  )
};
