"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NavDropdown } from "react-bootstrap";
import { useCounterStore } from './stores/useCounterStore.ts'
import {getDecryptedItem} from './auth/encript.js'

import {
  FaUserCircle,
  FaBell,
  FaSearch,
  FaCog,
} from "react-icons/fa";
import { useEffect, useState } from "react";

function ProfileDropdown() {
  const router = useRouter();

  function handleNavigate(path) {
    if (path === "logout") {
      localStorage.clear()
      router.push("/auth/login");
    }
  }

  let user= getDecryptedItem('user');
  const parsedUserDetails =
  typeof userDetails === "string"
    ? JSON.parse(user)
    : user;



  const profileIcon = (
    <div className="flex items-center gap-3 cursor-pointer">
      <img
        src="https://i.pravatar.cc/100"
        alt="profile"
        className="w-10 h-10 rounded-full border-2 border-blue-500"
      />
      <div className="hidden md:block text-start">
        <h6 className="text-white text-sm font-semibold m-0">
          {parsedUserDetails?.name}
        </h6>

        <p className="text-gray-400 text-xs m-0">
          {parsedUserDetails?.email}
        </p>
      </div>
    </div>
  );

  return (
    <NavDropdown
      title={profileIcon}
      id="profile-nav-dropdown"
      align="end"
      className="custom-dropdown"
    >
      <NavDropdown.Item href="#profile">
        👤 View Profile
      </NavDropdown.Item>

      <NavDropdown.Item href="#settings">
        ⚙️ Settings
      </NavDropdown.Item>

      <NavDropdown.Item href="#billing">
        💳 Billing
      </NavDropdown.Item>

      <NavDropdown.Divider />

      <NavDropdown.Item
        onClick={() => handleNavigate("logout")}
        className="text-danger"
      >
        🚪 Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
}

export default function Navbar() {

  const Item = useCounterStore((state) => state)
  const pathname = usePathname();

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      name: "Products",
      href: "/admin/dashboard/products",
    },
    {
      name: "Cart",
      href: "/admin/dashboard/ordersummary",
    },
    // {
    //   name: "Analytics",
    //   href: "/admin/dashboard/analytics",
    // },
  ];
  

  return (
    <nav
      className="flex justify-between items-center px-8 sticky top-0 z-50 py-1"
      style={{
        background:
          "linear-gradient(90deg, #0f172a 0%, #111827 50%, #1e293b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center gap-10">

        <ul className="hidden md:flex items-center gap-3 m-0 p-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.name} className="list-none">
                <Link
                  href={link.href}
                  className="no-underline px-4 py-2 rounded-4 transition-all button-underline flex gap-2 items-center"
                  style={{
                    color: isActive ? "#fff" : "#cbd5e1",
                    background: isActive
                      ? "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)"
                      : "transparent",
                    fontWeight: isActive ? "600" : "500",
                    transition: "0.3s ease",
                  }}
                >
                 
                {link.name}
                  {link.name === 'Cart' && <span class="bg-danger-soft border border-danger-subtle text-fg-danger-strong text-xs font-medium px-1.5 py-0.5 rounded-full">{Item.items.length}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center gap-4">

        {/* SEARCH */}
        <div
          className="hidden md:flex items-center gap-2 px-4 py-2"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: "14px",
            minWidth: "250px",
          }}
        >
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-0 outline-none text-white w-full"
            style={{
              fontSize: "14px",
            }}
          />
        </div>

        <button
          className="border-0 position-relative"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
          }}
        >
          <FaBell />

          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          >
            3
          </span>
        </button>

        <button
          className="border-0"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
          }}
        >
          <FaCog />
        </button>

        <div
          className="px-3 py-2"
          style={{
            background: "rgba(255,255,255,0.06)",
            borderRadius: "16px",
          }}
        >
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}