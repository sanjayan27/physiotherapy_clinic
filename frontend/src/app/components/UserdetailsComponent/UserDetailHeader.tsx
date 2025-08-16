import React from "react";
import Button from "../home_page_components/Button";
import { IoMdAdd } from "react-icons/io";
export const UserDetailHeader = () => {
  return (
    <header className="flex items-center justify-between p-5 my-2">
      <section className="title ">
        <p className="text-3xl font-semibold">Patient Dashboard</p>
        <p className="text-md text-gray-600">Manage your appointments and medical information</p>
      </section>
      <section>
        <Button
          name_button="Book Appointment"
          icon={<IoMdAdd />}
          style = " border border-teal-600 global-bg-color hover:bg-green-700 hover:border-green-700 text-white"
        navigation="/book-appointment"
        />
      </section>
    </header>
  );
};
