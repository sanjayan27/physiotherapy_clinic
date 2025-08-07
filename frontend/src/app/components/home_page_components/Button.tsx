"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

const Button = ({
  icon,
  name_button,
  border,
  background,
  hover,
  text_color,
  navigation
}: {
  icon?: ReactNode;
  name_button: string;
  border:string;
  background:string;
  hover:string;
  text_color:string;
  navigation : string
}) => {

  const router = useRouter()

  const navigate = ()=>{
    router.push(navigation)
  }

  return (
    <button onClick={navigate} className={`flex items-center gap-2 py-3 px-4 text-xs md:text-[16px] mt-4   rounded  ${background} ${hover} cursor-pointer transition font-sans ${border} ${text_color} `}>
      {icon && <span className="text-lg ">{icon}</span>}
      <span className="font-semibold">{name_button}</span>
    </button>
  );
};

export default Button;
