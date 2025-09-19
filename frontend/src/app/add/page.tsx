// app/add/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function AddPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  console.log("token", token);
  if (!token) {
    redirect("/login");
  }
  try {
    // verify & decode (replace "your-secret-key" with the same one used in NestJS)
    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
    console.log('decoded',decoded)
    // Check role
    if (decoded.role !== "admin" && decoded.role !== "superadmin") {
      redirect("/unauthorized"); // you can create a custom 403 page
    }

    return <h1>Add Page (Protected for Admins & Superadmins)</h1>;
  } catch (err) {
    console.error("Invalid token:", err);
    redirect("/login");
  }
  return <h1>Add Page (Protected)</h1>;
}
