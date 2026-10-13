import { Outlet } from "react-router";
import { Navbar } from "@/components/Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}
