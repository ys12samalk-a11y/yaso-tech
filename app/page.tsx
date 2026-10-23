import Hero from "@/components/sections/Hero";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyUs from "@/components/sections/WhyUs";
import LatestWorks from "@/components/sections/LatestWorks";
import SocialHub from "@/components/sections/SocialHub";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyUs />
      <LatestWorks />
      <SocialHub />
      <CTASection />
    </>
  );
}