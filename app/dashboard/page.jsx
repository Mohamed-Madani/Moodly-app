import Dashboard from "@/components/Dashboard.jsx";
import Main from "@/components/Main.jsx";


export const metadata= {
  title: "Moodly • Dashboard",
};

export default function DashboardPage() {
  
  return <Main className="">
    <Dashboard />
  </Main>;
}
