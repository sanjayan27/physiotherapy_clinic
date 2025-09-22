import AdminDashboard from "@/app/components/AdminDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import toast from "react-hot-toast";

async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (!token) {
    toast.error("Please login first")
    redirect("/login");
  }
   try {
     // verify & decode (replace "your-secret-key"` with the same one used in NestJS)
     console.log('decodded............')
        const decoded:any = jwt.decode(token.value);
        console.log('decodded',decoded)
        // Check role
        if (decoded.role !== "admin" && decoded.role !== "superadmin" ) {
          redirect("/unauthorized"); // you can create a custom 403 page
        }
      return (
        <section>
          <AdminDashboard />
        </section>
      );
    
  } catch (err) {
    toast.error("Invalid token")
    redirect("/login");
  }
}

export default page;
