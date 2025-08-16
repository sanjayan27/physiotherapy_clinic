import UserDetails from "@/app/components/UserdetailsComponent/UserProfileCard";
import { AppointmentStats } from "../components/UserdetailsComponent/AppointmentStats";
import { UserDetailHeader } from "../components/UserdetailsComponent/UserDetailHeader";
import UserProfileCard from "@/app/components/UserdetailsComponent/UserProfileCard";
import AppointmentsPage from "../components/UserdetailsComponent/AppointmentsPage";

export default function page() {
  return (
    <>
      <UserDetailHeader />
      <UserProfileCard />
      <AppointmentStats />
      <AppointmentsPage />
    </>
  );
}
