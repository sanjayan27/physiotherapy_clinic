"use client";

interface PersonalData {
  icon : string,
  name : string
}

export const PersonalData = (data: PersonalData ) => {
  return (
  <div className="flex items-center gap-2  ">
    <p className="global-text-color-teal text-xl">{data.icon}</p>
    <p className="text-gray-600">{data.name}</p>
  </div>
  )
};
