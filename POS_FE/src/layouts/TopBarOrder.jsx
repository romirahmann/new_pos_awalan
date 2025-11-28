/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaUser,
  FaAngleDoubleLeft,
} from "react-icons/fa";
import { useRouter, Link } from "@tanstack/react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useAlert } from "../store/AlertContext";
import { LuBookUser } from "react-icons/lu";
import dayjs from "dayjs";

export function TopbarOrder() {
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  // ⏰ Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    showAlert("success", "Logout Successfully!");
    router.navigate({ to: "/auth/login" });
  };

  return (
    <div className="w-full bg-primary shadow-soft px-3 md:px-6 py-3 flex items-center sticky top-0 z-50">
      <Link
        onClick={(e) => {
          e.preventDefault();
          if (window.history.length > 2) {
            router.history.go(-1); // 🔙 Kembali ke halaman sebelumnya
          } else {
            router.navigate({ to: "/" }); // fallback ke dashboard jika tidak ada history
          }
        }}
        className="flex items-center gap-2 text-white hover:text-accent transition cursor-pointer"
      >
        <FaAngleDoubleLeft />
      </Link>

      <div className="ms-5 font-bold text-white text-center">
        <h1>AWALAN'S ORDERS</h1>
      </div>

      <div className="flex items-center gap-4 relative ms-auto">
        <p className="text-white text-sm">
          🕒 {currentTime.format("DD MMM YYYY | HH:mm:ss")}
        </p>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 cursor-pointer hover:text-accent transition"
          >
            <FaUserCircle className="w-7 h-7 text-white" />
            <span className="text-white font-medium">
              {user?.fullname || "User"}
            </span>
          </button>

          {showMenu && (
            <div
              className="absolute right-0 mt-2 w-44 bg-surface shadow-card 
              rounded-xl z-50 border border-neutral-200"
            >
              <div className="px-4 py-5 text-sm">
                <span className="flex gap-2 items-center">
                  <FaUser /> {user?.username}
                </span>
                <p className="flex gap-2 items-center">
                  <LuBookUser /> {user?.jobdeskName}
                </p>
              </div>
              <hr />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-secondary 
                hover:text-danger w-full transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
