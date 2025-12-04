/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* Sidebar.jsx */
import { useEffect, useState } from "react";
import {
  FaHome,
  FaCashRegister,
  FaUsers,
  FaCog,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaUserShield,
  FaCalculator,
} from "react-icons/fa";
import { PiUserGearFill } from "react-icons/pi";
import { Link, useRouterState } from "@tanstack/react-router";
import { Tooltip } from "react-tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { MdFastfood } from "react-icons/md";
import { useSelector } from "react-redux";

// Menu definition with role & position rules
export const menuItems = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/",
    allowedRoles: ["OWNER", "ADMIN", "USER"],
    allowedPositions: ["MANAGER", "HEADBAR", "BARISTA", "KITCHEN"],
  },
  {
    name: "Orders",
    icon: <FaCashRegister />,
    path: "/orders/main-order",
    allowedRoles: ["OWNER", "ADMIN", "USER"],
    allowedPositions: ["MANAGER", "HEADBAR", "BARISTA", "KITCHEN"],
  },
  {
    name: "Transactions",
    icon: <FaCalculator />,
    path: "/transactions",
    allowedRoles: ["OWNER", "ADMIN"],
    allowedPositions: ["MANAGER"],
  },
  {
    name: "Products",
    icon: <MdFastfood />,
    path: "/products",
    allowedRoles: ["OWNER", "ADMIN"],
    allowedPositions: ["MANAGER", "HEADBAR"],
  },
  {
    name: "Settings",
    icon: <FaCog />,
    allowedRoles: ["OWNER", "ADMIN"],
    allowedPositions: ["MANAGER"],
    children: [
      {
        name: "Manage Users",
        icon: <FaUsers />,
        path: "/settings/users",
        allowedRoles: ["OWNER", "ADMIN"],
        allowedPositions: ["MANAGER"],
      },
      {
        name: "Manage Roles",
        icon: <FaUserShield />,
        path: "/settings/roles",
        allowedRoles: ["OWNER", "ADMIN"],
        allowedPositions: ["MANAGER"],
      },
      {
        name: "Manage Positions",
        icon: <PiUserGearFill />,
        path: "/settings/positions",
        allowedRoles: ["OWNER", "ADMIN"],
        allowedPositions: ["MANAGER"],
      },
    ],
  },
];

export function Sidebar({
  variant = "desktop",
  collapsed: initialCollapsed = false,
  onClose,
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [openMenu, setOpenMenu] = useState(null);
  const { location } = useRouterState();

  const { user } = useSelector((state) => state.auth);

  const toggleSubmenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const filterMenu = (items) => {
    return items
      .filter((item) => {
        const roleAllowed =
          !item.allowedRoles || item.allowedRoles.includes(user?.roleName);

        const positionAllowed =
          !item.allowedPositions ||
          item.allowedPositions.includes(user?.jobdeskName);

        return roleAllowed && positionAllowed;
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterMenu(item.children) : [],
      }));
  };

  const filteredMenu = filterMenu(menuItems);

  const sidebarContent = (
    <div
      className={`h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 shadow-lg transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      role="navigation"
    >
      {/* Logo / Collapse */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img
              src="/images/AWALAN-WHITE.png"
              alt="Logo"
              className="w-8 h-8"
            />
            <span className="font-bold text-xl">AWALAN POS</span>
          </div>
        )}
        {variant === "desktop" ? (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-700 transition"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        ) : (
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-700 transition"
            aria-label="Close Sidebar"
          >
            <FaAngleDoubleLeft />
          </button>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-4">
        {filteredMenu.map((item) => {
          const isActive =
            item.path && item.path !== "/"
              ? location.pathname.startsWith(item.path)
              : location.pathname === "/";

          if (item.children && item.children.length > 0) {
            const isParentActive = item.children.some((c) =>
              location.pathname.startsWith(c.path)
            );

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  aria-expanded={openMenu === item.name}
                  className={`w-full flex items-center gap-4 p-3 mx-2 my-1 rounded-lg transition-colors hover:bg-gray-700 ${
                    isParentActive
                      ? "bg-gray-700 font-semibold shadow-inner"
                      : ""
                  }`}
                >
                  <span className="w-5 h-5">{item.icon}</span>
                  {!collapsed && (
                    <span className="flex-1 text-left">{item.name}</span>
                  )}
                </button>

                {/* Submenu */}
                <AnimatePresence>
                  {openMenu === item.name && !collapsed && (
                    <motion.div
                      className="ml-8 mt-1 flex flex-col"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      {item.children.map((child) => {
                        const childActive = location.pathname.startsWith(
                          child.path
                        );
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            className={`flex items-center gap-3 p-2 my-1 rounded-lg transition-colors hover:bg-gray-700 ${
                              childActive ? "bg-gray-700 font-semibold" : ""
                            }`}
                          >
                            <span className="w-4 h-4">{child.icon}</span>
                            <span>{child.name}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3 mx-2 my-1 rounded-lg transition-colors hover:bg-gray-700 ${
                isActive ? "bg-gray-700 font-semibold shadow-inner" : ""
              }`}
              data-tooltip-id={collapsed ? "sidebar-tooltip" : undefined}
              data-tooltip-content={collapsed ? item.name : undefined}
            >
              <span className="w-5 h-5">{item.icon}</span>
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400 text-center">
          © 2025 AWALAN COFFEE
        </div>
      )}

      {/* Tooltip */}
      {collapsed && <Tooltip id="sidebar-tooltip" place="right" />}
    </div>
  );

  // Desktop → langsung render
  if (variant === "desktop") return sidebarContent;

  // Mobile → render dengan overlay + animasi
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-20 bg-black/30 backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        onClick={onClose}
      />

      {/* Sidebar */}
      <motion.div
        key="sidebar-mobile"
        className="fixed inset-y-0 left-0 z-30 w-64"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {sidebarContent}
      </motion.div>
    </AnimatePresence>
  );
}
