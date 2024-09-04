import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Main from "@/components/Main";
import type { Metadata } from "next";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/Loading";

export const metadata: Metadata = {
  title: "Moodly • Dashboard",
};

export default function DashboardPage() {
  
  return <Main className="">
    <Dashboard />
  </Main>;
}
