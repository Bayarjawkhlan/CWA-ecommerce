"use client";

import { cn } from "@/libs/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";

import { Category } from "@/types/types";

interface MainNavbarProps {
  data: Category[];
}

const MainNavbar: FC<MainNavbarProps> = ({ data }) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = data.map((route) => ({
    href: `/category/${route.id}`,
    label: route.name,
    active: pathname === `/category/${route.id}`,
  }));

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          href={route.href}
          key={route.href}
          className={cn(
            "text-sm font-medium transition hover:text-black",
            route.active ? "text-black" : "text-neutral-500",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNavbar;
