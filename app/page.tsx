import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import InstantVerify from '@/components/landing/InstantVerify';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PricingPreview from '@/components/landing/PricingPreview';

export default function Home() {
  return (
    <>
      <HeroSection />
      <InstantVerify />
      <HowItWorksSection />
      <PricingPreview />
      <Footer />
    </>
  );
}
