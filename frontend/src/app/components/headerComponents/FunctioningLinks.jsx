import { AppContext } from '@/app/context/AppContext'
import Link from 'next/link'
import React, { useContext } from 'react'
import { RiServiceFill } from "react-icons/ri";
import { LogOut,  HeartPlus } from 'lucide-react';

 const FunctioningLinks = ({handleUserAction,closeMenu,isMobile  }) => {
    const {isLogin}  = useContext(AppContext)
  return isLogin && (
    <section className='mb-12  flex flex-col gap-3 '>
        <Link href="/user-details" className=' py-4 w-full px-2 rounded text-gray-700 hover:text-teal-700 hover:bg-teal-50 border-b border-gray-100 transition-colors duration-150 flex flex-row items-center cursor-pointer gap-1' onClick={isMobile ? closeMenu : undefined}>
        <HeartPlus size={17}/>Your Details</Link> 
        <p  className=' py-4 w-full px-2 rounded text-gray-700 hover:text-teal-700 hover:bg-teal-50 border-b border-gray-100 transition-colors duration-150 flex flex-row cursor-pointer items-center gap-1'  onClick={() => handleUserAction("logout")}  > <LogOut size={17}/> Log Out</p>
    </section>
  )
}

export default FunctioningLinks