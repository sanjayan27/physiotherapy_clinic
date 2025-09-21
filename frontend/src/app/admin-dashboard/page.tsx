import AdminDashboard from "@/app/components/AdminDashboard";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (!token) {
    redirect("/login");
  }
   try {
        // verify & decode (replace "your-secret-key"` with the same one used in NestJS)
        const decoded:any = jwt.decode(token.value);
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
    console.error("Invalid token:", err);
    redirect("/login");
  }
}

export default page;
