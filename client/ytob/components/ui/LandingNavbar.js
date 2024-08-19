"use client";

import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useAuth } from "@/app/context/AuthContext";

const font = Montserrat({weight:"600",subsets:["latin"]});

function LandingNavbar() {
  const {isSignedIn} = useAuth();
  return (
    <div className="p-4 bg-transparent flex items-center justify-between lg:mx-8">
        <Link href="/" className="flex items-center">
                <div className="relative w-10 h-8 mr-4">
                    <img
                        alt="Logo"
                        src="/logo.jpg"
                    />
                </div>
                <h1 className={cn("text-1xl font-bold text-white",font.className)}>YtOB</h1>
        </Link>
        <div className="flex items-center gap-x-2">
            <Link href={isSignedIn ? "/dashboard": "/sign-up"}>
                <Button variant="outline" className="rounded-full">
                    Get Started
                </Button>
            </Link>

        </div>
    </div>
  )
}

export default LandingNavbar;