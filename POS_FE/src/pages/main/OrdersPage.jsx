import { Outlet } from "@tanstack/react-router";
import { TopbarOrder } from "../../layouts/TopBarOrder";

export function OrdersPage() {
  return (
    <>
      <div className="max-w-full">
        {/* Topbar selalu paling atas */}
        <div className="fixed top-0 left-0 w-full z-50">
          <TopbarOrder />
        </div>

        {/* Konten turun agar tidak ketutup Topbar */}
        <div className="main pt-12 overflow-hidden h-screen bg-gray-800">
          <Outlet />
        </div>
      </div>
    </>
  );
}
