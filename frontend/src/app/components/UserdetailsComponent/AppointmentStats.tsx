"use client"
import {Card} from "./CardForStats"


export const AppointmentStats = ()=>{
  //  const stats = {
  //   total: upcomingAppointments.length + appointmentHistory.length,
  //   upcoming: upcomingAppointments.length,
  //   completed: appointmentHistory.filter(apt => apt.status === 'completed').length,
  //   cancelled: appointmentHistory.filter(apt => apt.status === 'cancelled').length
  // };
   const stats = {
    total: 2,
    upcoming: 1,
    completed: 4,
    cancelled: 2
  };

  return (
    <section >
<        Card stats={stats}/>
    </section>
  )
}