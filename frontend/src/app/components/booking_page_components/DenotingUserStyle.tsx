import React from 'react'


type parameterTypes ={
    color : string,
    text:string
}
export const DenotingUserStyle = ({color,text}:parameterTypes) => {
  return (
    <div className="flex items-center gap-1 capitalize">
        <div className={`w-3 h-3 rounded-xs ${color}`}></div>
        <p>{text}</p>
    </div>
  )
}
