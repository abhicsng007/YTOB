"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Youtube, FileCheck2, Settings, Menu, Images, Share2 } from "lucide-react";
import { SiYoutubeshorts } from "react-icons/si";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CreditTracker from "./CreditTracker";

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
    requiresCredits: true,
  },
  {
    label: "Summarization",
    icon: FileCheck2,
    href: "/summarization",
    color: "text-blue-400",
    requiresCredits: true,
  },
  {
    label: "Text to Image",
    icon: Images,
    href: "/imagegeneration",
    color: "text-yellow-400",
  },
  {
    label: "Text to Post",
    icon: Share2,
    href: "/posts",
    color: "text-green-400",
  },
  {
    label: "Shorts Generator",
    icon: SiYoutubeshorts,
    href: "/shorts",
    color: "text-red-400",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-white",
  },
  
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [creditCount, setCreditCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      // Reset the state when the screen size changes
      setIsExpanded(false);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  

  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavigation = (href) => {
    let loadingTimer;
    let navigationCompleted = false;
  
    // Set a timer to show the loading icon after 300ms
    loadingTimer = setTimeout(() => {
      if (!navigationCompleted) {
        document.dispatchEvent(new Event('page-loading'));
      }
    }, 300);
  
    router.push(href);
  
    // Use a slight delay to ensure the navigation has started
    setTimeout(() => {
      navigationCompleted = true;
      clearTimeout(loadingTimer);
      document.dispatchEvent(new Event('page-loaded'));
    }, 100);
  };

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white shadow-lg transition-all duration-300 ease-in-out",
      isExpanded ? "w-64" : "sm:w-20 w-0",
    )}>
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={toggleExpand} 
          className="p-3 rounded-lg hover:bg-white/10 transition-all duration-300"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href='/'> 
          <div className={cn("flex items-center overflow-hidden", isExpanded ? "w-full justify-end" : "w-0")}>
            <div className="relative w-8 h-8 flex-shrink-0 ">
              <Image fill alt="Logo" src="/logo.jpg" />
            </div>
            <h1 className={cn("text-xl font-bold ml-2 whitespace-nowrap transition-all duration-300", montserrat.className, isExpanded ? "opacity-100" : "opacity-0")}>YTOB</h1>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto ml-2">
        <div className="space-y-2 px-2">
          {routes.map((route) => (
            <div
              key={route.href}
              onClick={() => handleNavigation(route.href)}
              className={cn(
                "flex items-center p-3 w-full rounded-lg transition-all duration-300 ease-in-out cursor-pointer",
                pathname === route.href
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center w-full">
                
                <route.icon className={cn("h-5 w-5 transition-all duration-300", route.color)} />
                
                <span className={cn(
                  "ml-3 text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
                )}>
                  {route.label}
                 
                </span>
                
              </div>
            </div>
          ))}
          <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {isExpanded && <CreditTracker/>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;