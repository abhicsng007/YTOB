"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Youtube, FileCheck2, Settings, Menu, X } from "lucide-react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-purple-400",
  },
  {
    label: "Video to Blog",
    icon: Youtube,
    href: "/videotoblog",
    color: "text-red-400",
  },
  {
    label: "Summarization",
    icon: FileCheck2,
    href: "/summarization",
    color: "text-blue-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-white",
  },
];

function MobileSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-90 p-2 rounded-lg bg-gray-900 text-white"
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white shadow-lg transition-transform duration-300 ease-in-out transform md:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/dashboard" className="flex items-center">
              <div className="relative w-8 h-8">
                <Image fill alt="Logo" src="./ai_logo.svg" />
              </div>
              <h1 className={cn("text-xl font-bold ml-2", montserrat.className)}>YTOB</h1>
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                href={route.href}
                key={route.href}
                className={cn(
                  "flex items-center p-3 w-full rounded-lg transition-colors duration-200",
                  pathname === route.href
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setIsOpen(false)}
              >
                <route.icon className={`h-5 w-5 mr-3 ${route.color}`} />
                <span className="text-sm font-medium">{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileSidebar;