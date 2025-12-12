"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navConfig(pathname) {
  if (pathname.startsWith("/admin")) {
    return {
      brand: { label: "HeadsUp Admin", href: "/admin/dashboard" },
      items: [
        { label: "Dashboard", href: "/admin/dashboard" },
        { label: "Disaster types", href: "/admin/disaster-type" },
        { label: "Disasters", href: "/admin/disasters" },
        { label: "Users", href: "/admin/users" },
        { label: "Sign out / switch", href: "/signin" },
      ],
    };
  }

  if (pathname.startsWith("/user")) {
    return {
      brand: { label: "HeadsUp", href: "/user/dashboard" },
      items: [
        { label: "Feed", href: "/user/dashboard" },
        { label: "Map", href: "/user/map" },
        { label: "Sign out / switch", href: "/signin" },
      ],
    };
  }

  return {
    brand: { label: "HeadsUp", href: "/" },
    items: [
      { label: "Register", href: "/register" },
      { label: "Login", href: "/signin" },
      { label: "More info", href: "/info" },
    ],
  };
}

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function NavBar() {
  const pathname = usePathname() || "/";
  const { brand, items } = navConfig(pathname);

  return (
    <nav className="sticky top-0 z-40 border-b border-[#E5D0AC] bg-[#FFF8E1] text-[#6D2323] shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={brand.href} className="flex items-center gap-2 text-lg font-semibold text-[#A31D1D] hover:underline">
          <img src="/HeadsUp.png" alt="HeadsUp logo" className="h-10 w-13 object-contain" />
          <span>{brand.label}</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-1 transition ${
                  active
                    ? "bg-[#E5D0AC] text-[#880D1E] font-semibold"
                    : "hover:bg-[#CBEEF3] hover:text-[#A31D1D]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
