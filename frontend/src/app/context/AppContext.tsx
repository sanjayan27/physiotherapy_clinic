"use client";

import React, { createContext, useEffect, useRef, useState } from "react";

export interface AppContextValue {
  dateClicked: boolean;
  setDateClicked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDate: string | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSlots: string | null;
  setSelectedSlots: React.Dispatch<React.SetStateAction<string | null>>;
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  userLogged: boolean;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  role: string;
  formRefForScroll: React.RefObject<HTMLDivElement | null>;
  handleScrollToForm: (slot: string) => void;
  setUserList:React.Dispatch<React.SetStateAction<any>>
  userList:any
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [dateClicked, setDateClicked] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const formRefForScroll = useRef<HTMLDivElement | null>(null);
  const [role, setRole] = useState<string>("");
  const [userList,setUserList] = useState(null)
  const checkUsreRole = () => {
    try {
      const userRole = JSON.parse(localStorage?.getItem("user") || "null");
      setRole(userRole?.role || "");
    } catch {}
  };

  useEffect(() => {
    checkUsreRole();
  }, [isLogin]);

  const handleScrollToForm = (slot: string) => {
    setSelectedSlots(slot);
    formRefForScroll.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const checkUserLoggedIn = localStorage.getItem("isLogin");
    if (checkUserLoggedIn === "true") {
      setIsLogin(true);
    }
  }, []);

  const value: AppContextValue = {
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
    setSelectedSlots,
    setUserList,
    userList
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
