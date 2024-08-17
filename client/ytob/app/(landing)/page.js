"use client";

import LandingContent from "@/components/ui/LandingContent";
import LandingFooter from "@/components/ui/LandingFooter";
import LandingHero from "@/components/ui/LandingHero";
import LandingNavbar from "@/components/ui/LandingNavbar";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


function LandingPage() {
 const { isSignedIn } = useAuth();
 const router = useRouter();

 useEffect(() => {
  if(isSignedIn){
    router.push('/dashboard');
  }
 },[isSignedIn]);

  return (
    <div >
            <LandingNavbar/>
            <LandingHero/>
            <LandingContent/>
            <LandingFooter/>
    </div>
  )
}

export default LandingPage;