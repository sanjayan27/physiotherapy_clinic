import React from "react";
import { FaWhatsapp } from "react-icons/fa";
export const WhatsappChatbot = () => {
  return (
    <div className="fixed right-10 bottom-10 shrink-0">
      <button
        onClick={() =>
          window.open(
            "https://wa.me/+914426790071?text=Hi%20I%20want%20to%20book%20an%20appointment",
            "_blank"
          )
        }
        className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-700 cursor-pointer"
      >
        <FaWhatsapp className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};
