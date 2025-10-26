"use client";
import { AppContext } from "@/app/context/AppContext";
import { listAllUser } from "@/app/services/adminAppointment.service";
import { Search, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ListAllUsersData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  //getting data from useContext
  const { setUserList, userList }: any = useContext(AppContext);
  const fetchAllUsers = async () => {
    setIsLoading(true);
    try {
      const response = await listAllUser();
      if (response && Array.isArray(response)) {
        const users = response.filter((user: any) => user.role === "user");
        setUserData(users);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.log(err.message);
      toast.error("Failed to fetch users.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleBookAppointment = async (user: any) => {
    setUserList(user);
  };

  const filteredUsers = userData.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    const nameMatch = user.name?.toLowerCase().includes(searchTermLower);
    const idMatch = user.id?.toLowerCase().includes(searchTermLower);
    return nameMatch || idMatch;
  });

  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-10 ">
      <h1 className="mt-10 text-2xl font-bold text-gray-700">User List</h1>
      <div className="w-full max-w-4xl px-4">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by Name or Patient ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <Table size="small" className="max-w-4xl bg-white rounded-lg shadow-md">
        <TableHead>
          <TableRow className="bg-gray-50">
            <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Registered Date</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        {isLoading ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center">
                Loading User records...
              </TableCell>
            </TableRow>
          </TableBody>
        ) : filteredUsers.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center">
                No patient records found for this filter.
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {filteredUsers?.map((user: any, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ textTransform: "capitalize" }}>
                  {user.name}
                </TableCell>
                <TableCell>
                  <div>{user.phoneNumber}</div>
                  <div>{user.email}</div>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Typography
                    color="primary"
                    sx={{ cursor: "pointer" }}
                    className="bg-green-100 max-w-fit px-2 py-1 rounded-lg"
                  >
                    <Link
                      href={"/book-appointment"}
                      onClick={() => handleBookAppointment(user)}
                    >
                      + Book
                    </Link>
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </main>
  );
};
