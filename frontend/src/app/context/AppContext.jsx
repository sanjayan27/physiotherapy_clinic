"use client"

import { createContext, useRef, useState } from "react";

export const AppContext = createContext()

export const AppContextProvider = (props)=>{
    const [dateClicked,setDateClicked] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedSlots, setSelectedSlots] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const formRefForScroll = useRef() 
    //for scrolling when user select the slot
    const handleScrollToForm=(slot)=>{
        setSelectedSlots(slot)
        formRefForScroll.current?.scrollIntoView({behavior:"smooth"})
    }

    const value = {
        dateClicked,
        setDateClicked,
        setSelectedDate,
        selectedDate,
        handleScrollToForm,
        formRefForScroll,
        selectedSlots,
        userLogged
    }
    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
}