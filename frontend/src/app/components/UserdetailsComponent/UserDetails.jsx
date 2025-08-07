"use client"

import React, { useContext } from 'react'
import { AppContext } from "@/app/context/AppContext";

 const UserDetails = () => {
    
    const {userLogged} = useContext(AppContext)
    
  return (
    <div>UserDetails</div>
  )
}
export default UserDetails