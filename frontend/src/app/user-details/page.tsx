import { AppointmentStats } from "../components/UserdetailsComponent/AppointmentStats";
import { UserDetailHeader } from "../components/UserdetailsComponent/UserDetailHeader";
import UserProfileCard from "@/app/components/UserdetailsComponent/UserProfileCard";
import AppointmentsPage from "../components/UserdetailsComponent/AppointmentsPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function page() {
  const cookieStore = await cookies();
    const token = cookieStore.get("auth_token");
    if (!token) {
      console.log("no token")
      redirect("/login");
    }

    try {
     const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);

      // verify & decode (replace "your-secret-key"` with the same one used in NestJS)
      // const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
      console.log("decoded", decoded);
      // Check role
      if (decoded.role !== 'user' ) {
        console.log('redirecting')
        redirect("/unauthorized"); // you can create a custom 403 page
      }
  return (
    <>
      <UserDetailHeader />
      <UserProfileCard />
      <AppointmentStats />
      <AppointmentsPage />
    </>
  ) } catch (err) {
    console.error("Invalid token:", err);
    redirect("/login");
  }
}
