"use client";

import { createContext, useEffect, useRef, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [dateClicked, setDateClicked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [userId, setUserId] = useState(null);
  const formRefForScroll = useRef();
  //for scrolling when user select the slot
  const [role, setRole] = useState("");
  const checkUsreRole = () => {
    const userRole = JSON.parse(localStorage?.getItem("user"));

    setRole(userRole?.role);
  };
  useEffect(() => {
    checkUsreRole();
  }, [role]);
  const handleScrollToForm = (slot) => {
    setSelectedSlots(slot);
    formRefForScroll.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const checkUserLoggedIn = localStorage.getItem("isLogin");
    if (checkUserLoggedIn === "true") {
      setIsLogin(true);
    }
  }, [isLogin]);

  const value = {
    dateClicked,
    setDateClicked,
    setSelectedDate,
    selectedDate,
    handleScrollToForm,
    formRefForScroll,
    selectedSlots,
    userLogged,
    isLogin,
    setIsLogin,
    setUserId,
    userId,
    role,
    setSelectedSlots
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
