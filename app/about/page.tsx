import Exper from "@/components/component/About/Exper";
import Experinces from "@/components/component/About/Experince";
import Hero from "@/components/component/About/Hero";
import TimelineGallery from "@/components/component/About/TimelineGallery";
import Navbar from "@/components/component/Home/Navbar";



export default function  ABoutPage(){
    return(
        <>
        <Navbar/>
        <div className="bg-[#1e1f22] min-w-screen min-h-screen">
            <Hero/>
            <Experinces/>
            <TimelineGallery/>
            <Exper/>
        </div>
        </>
    )
}