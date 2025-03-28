"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { MessageSquare, BarChart3 } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={cn("border-b bg-background")}>
      <div className={cn("container flex h-14 items-center")}>
        <div className={cn("mr-4 flex")}>
          <Link href="/" className={cn("flex items-center space-x-2")}>
            <span className={cn("font-bold")}>Property Appraisal</span>
          </Link>
        </div>
        <div className={cn("flex flex-1 items-center justify-end space-x-2")}>
          <Button
            variant={pathname === "/analyze" ? "default" : "ghost"}
            asChild
            className={cn("gap-2")}
          >
            <Link href="/analyze">
              <BarChart3 className={cn("h-4 w-4")} />
              <span>Analyze</span>
            </Link>
          </Button>
          <Button
            variant={pathname === "/chat" ? "default" : "ghost"}
            asChild
            className={cn("gap-2")}
          >
            <Link href="/chat">
              <MessageSquare className={cn("h-4 w-4")} />
              <span>Chat</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}