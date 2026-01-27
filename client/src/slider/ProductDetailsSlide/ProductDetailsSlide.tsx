"use client";

import "react-inner-image-zoom/lib/styles.min.css";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { apiBaseUrl } from "@/config/config";
import { Swiper as SwiperClass } from "swiper";
import { AnimationControls } from "framer-motion";
import InnerImageZoom from "react-inner-image-zoom";
import { motion } from "framer-motion";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
interface Props {
  thumbnailImage: string;
  backViewImage: string;
  images: string[];
  name: string;
  controls: AnimationControls;
}

const ProductDetailsSlide: React.FC<Props> = ({
  controls,
  images,
  thumbnailImage,
  backViewImage,
}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const allImages = [
    ...(thumbnailImage ? [thumbnailImage] : []),
    ...(backViewImage ? [backViewImage] : []),
    ...images,
  ];


  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  interface ThumbnailClickHandler {
    (index: number): void;
  }

  const handleThumbnailClick: ThumbnailClickHandler = (index) => {
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div>
      <div className="relative flex justify-center mt-6 md:mt-8 lg:mt-0">
        {/* Main image preview (Zoomable) */}
        <div className="w-full  max-w-[360px] h-[300px] sm:max-w-[590px] md:max-w-[710px] md:h-[400px] xl:max-w-[720px] xl:h-[500px] rounded overflow-hidden">
          <Swiper
            modules={[Navigation]}
            // navigation
            onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            initialSlide={selectedImageIndex}
            className="w-full h-full"
          >
            {allImages.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full  bg-white">
                  <InnerImageZoom
                    src={apiBaseUrl + img}
                    zoomSrc={apiBaseUrl + img}
                    zoomType="hover"
                    zoomScale={1}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="custom-prev cursor-pointer absolute left-8 top-1/2 transform -translate-y-1/2  z-10"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <MdArrowBackIos className="text-2xl" />
          </button>
          <button
            className="custom-next cursor-pointer absolute right-8 top-1/2 transform -translate-y-1/2 l z-10"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <MdArrowForwardIos className="text-2xl" />
          </button>
        </div>

        {/* Overlay image on top (only for md and above) */}
        <div className="hidden   md:block absolute top-0 w-full max-w-[590px] h-[400px] md:h-[400px] rounded  pointer-events-none">
          <motion.div animate={controls}>
            <div className="relative w-full h-[400px] md:h-[400px] bg-white">
              <Image
                src={apiBaseUrl + allImages[selectedImageIndex]}
                alt={"Product Image"}
                width={500}
                height={500}
                className="w-full h-full z-10  object-cover rounded"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-4  min-w-fit py-2 rounded">
          {allImages.map((img, index) => (
            <div
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className="cursor-pointer border-2 rounded transition-all duration-200 hover:border-black"
              style={{
                borderColor:
                  selectedImageIndex === index ? "#000" : "transparent",
              }}
            >
              <div className="relative w-[55px] h-[55px] md:w-[125px] md:h-[125px] lg:w-[119px] lg:h-[119px] xl:w-[125px] xl:h-[125px]">
                <Image
                  src={apiBaseUrl + img}
                  alt={`Thumbnail ${index}`}
                  fill
                  className="rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSlide;
