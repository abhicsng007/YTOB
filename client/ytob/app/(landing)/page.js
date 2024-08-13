import LandingContent from "@/components/ui/LandingContent";
import LandingFooter from "@/components/ui/LandingFooter";
import LandingHero from "@/components/ui/LandingHero";
import LandingNavbar from "@/components/ui/LandingNavbar";


function LandingPage() {
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