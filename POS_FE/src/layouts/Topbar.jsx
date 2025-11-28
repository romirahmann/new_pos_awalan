/* eslint-disable no-unused-vars */
/* Topbar.jsx */
import { useEffect, useState } from "react";
import {
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouterState, Link, useRouter } from "@tanstack/react-router";
import { menuItems } from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useAlert } from "../store/AlertContext";
import { LuBookUser } from "react-icons/lu";

function getAllPaths(items) {
  let paths = [];
  items.forEach((item) => {
    if (item.path) paths.push(item.path);
    if (item.children) paths = [...paths, ...getAllPaths(item.children)];
  });
  return paths;
}
const validPaths = getAllPaths(menuItems);

export function Topbar({ openSidebar }) {
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const { user } = useSelector((state) => state.auth);
  const { location } = useRouterState();
  const router = useRouter();

  const handleSearch = (e) => setSearch(e.target.value);

  const handleLogout = () => {
    dispatch(logout());
    showAlert("success", "Logout Successfully!");
    router.navigate({ to: "/auth/login" });
  };

  // === Breadcrumb generator ===
  const pathParts = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const to = "/" + pathParts.slice(0, index + 1).join("/");
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    const isValid = validPaths.includes(to);
    return { label, to, isValid };
  });

  return (
    <>
      {/* Topbar utama */}
      <div className="w-full bg-primary shadow-soft px-3 md:px-6 py-3 flex items-center">
        {/* tombol sidebar mobile */}
        <button
          onClick={() => openSidebar()}
          className="sm:hidden me-5 text-white hover:text-accent transition"
        >
          <GiHamburgerMenu size={22} />
        </button>

        {/* search */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="relative lg:w-[26rem]">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search anything..."
              className="pl-12 w-full bg-neutral-100 pr-4 py-2.5 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-accent text-gray-900 shadow-inner"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex ms-auto items-center gap-4 relative">
          {/* Notification */}
          {/* <button className="relative p-2 rounded-full hover:bg-secondary transition">
            <FaBell className="text-white w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full animate-ping"></span>
          </button> */}

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

            {/* Dropdown */}
            {showMenu && (
              <div
                className="absolute right-0 mt-2  w-44 bg-surface shadow-card 
                rounded-xl  z-50 border border-neutral-200"
              >
                <div className="user px-4 py-5">
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
                  className="flex  items-center gap-2 px-4 py-2 text-secondary 
                   hover:text-danger w-full  transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="w-full bg-neutral-100 py-2 px-4 shadow-inner">
        <div className="text-secondary text-sm flex gap-1 items-center">
          <Link to="/" className="hover:underline text-primary font-medium">
            Dashboard
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex gap-1 items-center">
              <span className="text-gray-400">/</span>
              {idx === breadcrumbs.length - 1 || !crumb.isValid ? (
                <span className="font-semibold text-primary">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.to} className="hover:underline">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
