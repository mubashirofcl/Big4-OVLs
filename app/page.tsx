import AboutSection from "@/components/component/Home/AboutSection";
import BrandsSection from "@/components/component/Home/Brands";
import Categories from "@/components/component/Home/Categories";
import CatalogSection from "@/components/component/Home/Catlog";
import Hero from "@/components/component/Home/Hero";
import InfiniteGallery from "@/components/component/Home/InfiniteGallery";
import Navbar from "@/components/component/Home/Navbar";
import ScrollGallery from "@/components/component/Home/ScrollGallery";
import ShowroomSection from "@/components/component/Home/ShowroomSection";
import PageLoader from "@/components/ui/PageLoader";

export default function Home() {
  return (
    <>
      <PageLoader />
      <div className="bg-background">
        <Navbar />
        <Hero />
        <InfiniteGallery/>
        <Categories />
        <AboutSection />
        <ScrollGallery/>
        <BrandsSection />
        <CatalogSection />
        <ShowroomSection />
      </div>
    </>
  );
}