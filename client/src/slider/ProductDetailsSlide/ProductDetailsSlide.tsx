"use client";

import "react-inner-image-zoom/lib/styles.min.css";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { Swiper as SwiperClass } from "swiper";
import { motion } from "framer-motion";
import InnerImageZoom from "react-inner-image-zoom";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";

interface Props {
  thumbnailImage: string;
  backViewImage: string;
  optionalImages: string[];
  name: string;
  controls: any;
  videoUrl?: string;
}

const ProductDetailsSlide: React.FC<Props> = ({
  controls,
  optionalImages,
  thumbnailImage,
  backViewImage,
  videoUrl,
  name,

}) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const allMedia = [
    ...(thumbnailImage ? [{ type: "image", src: thumbnailImage }] : []),
    ...(backViewImage ? [{ type: "image", src: backViewImage }] : []),
    ...optionalImages.map((img) => ({ type: "image", src: img })),
    ...(videoUrl ? [{ type: "video", src: videoUrl }] : []),
  ];

  interface ThumbnailClickHandler {
    (index: number): void;
  }

  const handleThumbnailClick: ThumbnailClickHandler = (index) => {
    setSelectedImageIndex(index);
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const extractYouTubeId = (url: string) => {
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regExp);
    return match ? match[1] : url;
  };


  return (
    <div>
      <div className="relative flex justify-center mt-6 md:mt-8 lg:mt-0">
        {/* Main image preview (Zoomable) */}
        <div className="w-full  max-w-[360px] h-[300px] sm:max-w-[590px] md:max-w-[710px] md:h-[400px] xl:max-w-[720px] xl:h-[500px] rounded overflow-hidden">
          <Swiper
            modules={[Navigation]}
            onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            initialSlide={selectedImageIndex}
            className="w-full h-full"
          >
            {allMedia.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full bg-white flex items-center justify-center">

                  {item.type === "image" ? (
                    <InnerImageZoom
                      src={item.src}
                      zoomSrc={item.src}
                      zoomType="hover"
                      zoomScale={1}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(item.src)}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}

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
              {allMedia[selectedImageIndex]?.type === "image" ? (
                <Image
                  src={allMedia[selectedImageIndex]?.src}
                  alt="Product Image"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(
                    allMedia[selectedImageIndex]?.src
                  )}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-none">
        <div className="flex gap-4 min-w-fit py-2 rounded">
          {allMedia.map((item, index) => (
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
                {item.type === "image" ? (
                  <Image
                    src={item.src}
                    alt={`Thumbnail ${index}`}
                    fill
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full rounded overflow-hidden">
                    <Image
                      src={`https://img.youtube.com/vi/${extractYouTubeId(item.src)}/hqdefault.jpg`}
                      alt="Video Thumbnail"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <FaYoutube className="text-red-600 text-7xl drop-shadow-xl" />
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProductDetailsSlide;
