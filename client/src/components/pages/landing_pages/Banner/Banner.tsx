import { getAllBanners } from "@/services/banners";
import BannerSlider from "@/slider/BannerSlider/BannerSlider";
import { TBanner } from "@/types";
import React from "react";
export const dynamic = "force-dynamic";
interface BannerProps {
  banners: TBanner[];
}
const Banner: React.FC<BannerProps> = async () => {
  const { data } = await getAllBanners()


  return (
    <div className="mt-14 lg:mt-16  lg:w-9/12 h-full w-full mx-auto ">
      <BannerSlider banners={data} />
    </div>
  );
};

export default Banner;
