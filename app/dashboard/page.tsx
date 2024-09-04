import Dashboard from "@/components/Dashboard";
import Login from "@/components/Login";
import Main from "@/components/Main";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moodly • Dashboard",
};

export default function DashboardPage() {
  const isAuthenticated = true;

  let children = <Login />;

  if (isAuthenticated) {
    children = <Dashboard />;
  }
  return <Main className="">
    {children}
  </Main>;
}
