import { Outlet } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-content-bg">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
