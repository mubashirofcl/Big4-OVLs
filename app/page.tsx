import AboutSection from "@/components/component/Home/AboutSection";
import BrandsSection from "@/components/component/Home/Brands";
import Categories from "@/components/component/Home/Categories";
import CatalogSection from "@/components/component/Home/Catlog";
import Hero from "@/components/component/Home/Hero";
import Navbar from "@/components/component/Home/Navbar";
import ShowroomSection from "@/components/component/Home/ShowroomSection";
import PageLoader from "@/components/ui/PageLoader";

export default function Home() {
  return (
    <>
      <PageLoader />
      <div className="bg-background">
        <Navbar />
        <Hero />
        <Categories />
        <AboutSection />
        <BrandsSection />
        <CatalogSection />
        <ShowroomSection />
      </div>
    </>
  );
}