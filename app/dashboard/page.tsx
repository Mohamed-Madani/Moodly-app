import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Main from "@/components/Main";
import type { Metadata } from "next";
import { useAuth } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Moodly • Dashboard",
};

export default function DashboardPage() {
  const {currentUser, loading} = useAuth()

  let children = <Login />;

  if (loading) {
    
  }

  if (currentUser) {
    children = <Dashboard />;
  }
  return <Main className="">
    {children}
  </Main>;
}
