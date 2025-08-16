import React from "react";

interface CardForHomeProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const CardForHome: React.FC<CardForHomeProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div
      className="bg-white rounded-lg border-1 shadow border-gray-200 p-6 flex flex-col items-start  hover:shadow-lg transition-shadow duration-300 w-[80vw] sm:w-[40vw] md:w-[30vw] lg:w-[25vw] 
            "
    >
      {icon && (
        <div className="mb-4 text-white global-bg-color  p-1 rounded-xl text-4xl ">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold font-sans mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default CardForHome;
