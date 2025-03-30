"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { MessageSquare, BarChart3, Home } from "lucide-react";

const navItems = [
  {
    href: "/",
    icon: Home,
    label: "Home",
    showLabel: false,
  },
  {
    href: "/analyze",
    icon: BarChart3,
    label: "Analyze",
    showLabel: true,
  },
  {
    href: "/chat",
    icon: MessageSquare,
    label: "Chat",
    showLabel: true,
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={cn("sticky top-0 z-50 border-b bg-background/95 backdrop-blur")}>
      <div className={cn("container flex h-14 items-center px-6")}>
        <div className={cn("mr-8 flex")}>
          <Link href="/" className={cn("flex items-center")}>
            <Image
              src="/altumai-svg.svg"
              alt="Altum AI Logo"
              width={50}
              height={28}
            />
          </Link>
        </div>
        <div className={cn("flex flex-1 items-center justify-end space-x-2")}>
          {navItems.map(({ href, icon: Icon, label, showLabel }) => (
            <Button
              key={href}
              variant={pathname === href ? "default" : "ghost"}
              asChild
              className={cn("gap-2", !showLabel && "px-3")}
            >
              <Link href={href}>
                <Icon className={cn("h-4 w-4")} />
                {showLabel && <span>{label}</span>}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}