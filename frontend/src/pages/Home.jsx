import React from 'react'
import { GridBackgroundDemo, FeaturesSection,NewsletterSection, HowItWorks, PopularCodingProblems, LearnFromResources, TestimonialsSection, FAQSection } from '../components/ui/GridBackgroundDemo'
import Navbar from '../components/section/Navbar'
import Footer from '../components/section/Footer'
import LogoLoop from '../components/ui/LogoLoop';


const companyLogos = [
  { src: "/accenture.png",height: 80, alt: "Accenture", href: "https://www.accenture.com" },
  { src: "/cognizant.png", height: 100, alt: "Cognizant", href: "https://www.cognizant.com" },
  { src: "/infosys.png", alt: "Infosys", href: "https://www.infosys.com" },
  { src: "/ibm.png", alt: "Microsoft", href: "https://microsoft.com" },
  { src: "/wipro.png", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/deloitte.png", height: 108,alt: "Amazon", href: "https://amazon.com" },
  { src: "/Capgemini.png",height: 80, alt: "Google", href: "https://google.com" },
  { src: "/lti-mind.png",height: 80, alt: "Meta", href: "https://meta.com" },
  { src: "/amazon3.jpg",height: 80, alt: "Amazon", href: "https://amazon.com" },
  { src: "/microsoft.png",height: 90, alt: "Meta", href: "https://meta.com" },
  { src: "/tcs.png", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/Google.png", height: 85,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/tech-mahindra-02.png", height: 50,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/zomato.jpg", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/sap.jpg", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/vmware.jpg", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/swiggy.jpg", height: 60,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/phonepay.jpg", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/paytm.jpg", height: 50,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/saleforce.jpg", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/zerodha.jpg", height: 90,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/cred.jpg", height: 160,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/flipkart.jpg", height: 110,alt: "TCS", href: "https://www.tcs.com" },
  { src: "/adobe.jpg", height: 120,alt: "TCS", href: "https://www.tcs.com" },
];

function Home() {
  return <>
    <div>
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      <GridBackgroundDemo />
      <FeaturesSection />
      <HowItWorks />
      <PopularCodingProblems />
      <LearnFromResources />

      <div className="text-center py-10 bg-black">
         <h2 className="text-3xl font-bold text-white">
           Practice Questions From Top Tech Companies
         </h2>
         <p className="mt-2 text-gray-400">
           Prepare for placements and interviews with problems inspired by industry leaders
         </p>
       </div>
      <div style={{ height: '150px', backgroundColor:"black", position: 'relative', overflow: 'hidden'}}>
      <LogoLoop
        logos={companyLogos}
        speed={100}
        direction="left"
        logoHeight={48}
        gap={40}
        leftmargin={2}
        rightmargin={2}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="transparent"
        ariaLabel="Technology partners"
      />
    </div>


     {/* <TestimonialsSection /> */}
      <FAQSection />
      <NewsletterSection />
      <Footer />
    </div>
  </>
}

export default Home;
