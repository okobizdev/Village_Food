"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { TCategory } from "@/types/category";

interface CategoryProps {
  categoriesList: TCategory[];
}

const CategoryCardSlider: React.FC<CategoryProps> = ({ categoriesList }) => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // Sort categories by status
  const sortedCategories = [...(categoriesList || [])].sort(
    (a, b) => Number(b.status) - Number(a.status)
  );

  return (
    <div className="w-full max-w-7xl mx-auto py-12">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
          Shop by <span className="text-primary">Category</span>
        </h2>
        {/* Navigation Buttons */}
        <div className="flex items-center md:gap-3">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="group p-2 lg:p-3 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="group p-2 lg:p-3 rounded-full bg-white border-2 border-gray-200 hover:border-primary hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* Swiper Carousel */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          onSwiper={setSwiperInstance}
          spaceBetween={24}
          slidesPerView={1}
          loop={sortedCategories.length >= 3}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="category-hero-swiper"
        >
          {sortedCategories.map((category, index) => (
            <SwiperSlide key={category._id || index}>
              <Link href={`/shop?category=${category.slug}`}
                className="cursor-pointer"
              >
                <div className="group relative overflow-hidden rounded-md aspect-[4/3] cursor-pointer">
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <Image
                      src={category.image || "/placeholder-category.png"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
                    {/* Category Name - Top Left */}
                    <div>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-2xl leading-tight tracking-wide">
                        {category.name}
                      </h3>
                    </div>

                    {/* CTA Button - Bottom Left */}
                    <div>
                      <button className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full text-gray-900 font-semibold text-sm md:text-base shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer ">
                        <span className="bangla-text">Explore Collections</span>
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Decorative Corner Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`


        .category-hero-swiper .swiper-slide {
          height: auto;
        }

        .category-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #d1d5db;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .category-pagination .swiper-pagination-bullet-active {
          background: #10b981;
          width: 32px;
          border-radius: 5px;
        }

        /* Smooth transitions */
        .category-hero-swiper .swiper-slide img {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};

export default CategoryCardSlider;