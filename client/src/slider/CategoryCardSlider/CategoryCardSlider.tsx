"use client";

import { TCategory } from "@/types";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { apiBaseUrl } from "@/config/config";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryProps {
  categoriesList: TCategory[];
}

const CategoryCardSlider: React.FC<CategoryProps> = ({ categoriesList }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sortedCategories = [...(categoriesList || [])].sort(
    (a, b) => Number(b.status) - Number(a.status)
  );

  // Generate upcoming cards if less than 6 categories
  const minCategories = 7;
  const displayCategories = [...sortedCategories];
  
  if (sortedCategories.length < minCategories) {
    const upcomingCount = minCategories - sortedCategories.length;
    for (let i = 0; i < upcomingCount; i++) {
      displayCategories.push({
        _id: `upcoming-${i}`,
        name: "Upcoming",
        slug: "",
        image: "",
        status: 0,
        isUpcoming: true
      } as unknown as TCategory & { isUpcoming?: boolean });
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Track scroll position for indicators
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.scrollWidth / displayCategories.length;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [displayCategories.length]);

  // Auto sliding with reverse
  useEffect(() => {
    let direction: "left" | "right" = "right";
    
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (direction === "right" && container.scrollLeft >= maxScroll - 10) {
          direction = "left";
        } else if (direction === "left" && container.scrollLeft <= 10) {
          direction = "right";
        }
        
        scroll(direction);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full lg:px-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-bold mt-1 mb-3 ">
            Explore our wide range of products
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-[#FF6C0C] hover:bg-[#FF6C0C] hover:text-white transition-all duration-300 shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white border-2 border-gray-200 hover:border-[#FF6C0C] hover:bg-[#FF6C0C] hover:text-white transition-all duration-300 shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayCategories?.map((category, index) => {
            const isUpcoming = 'isUpcoming' in category && category.isUpcoming;
            
            return (
              <Link
                key={category._id}
                href={isUpcoming ? "#" : `/shop?category=${category.slug || category._id}`}
                className="flex-shrink-0 snap-start"
                onClick={(e) => isUpcoming && e.preventDefault()}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: isUpcoming ? 1 : 1.03 }}
                  className={`group relative w-32 h-40 sm:w-40 sm:h-52 md:w-48 md:h-64 lg:w-60 lg:h-80 bg-white border-2 ${
                    isUpcoming 
                      ? "border-dashed border-gray-300 bg-gray-50" 
                      : "border-gray-200 hover:border-[#FF6C0C] hover:shadow-2xl"
                  } rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 ${
                    isUpcoming ? "cursor-default" : "cursor-pointer"
                  } flex flex-col`}
                >
                  {isUpcoming ? (
                    <div className="relative w-full flex-1 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto mb-2 sm:mb-3 rounded-full bg-white/80 flex items-center justify-center">
                          <span className="text-2xl sm:text-3xl lg:text-4xl">🎁</span>
                        </div>
                        <p className="text-xs sm:text-sm lg:text-base font-semibold text-gray-400">
                          Coming Soon
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full flex-1">
                      <Image
                        src={apiBaseUrl + category.image || ""}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 240px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-1.5 sm:p-2 lg:p-3 text-center bg-white">
                    <p className={`text-xs sm:text-sm lg:text-base font-semibold ${
                      isUpcoming 
                        ? "text-gray-400" 
                        : "text-gray-700 group-hover:text-[#FF6C0C]"
                    } transition-colors duration-300 capitalize line-clamp-2`}>
                      {isUpcoming ? "Upcoming" : category.name}
                    </p>
                  </div>

                  {!isUpcoming && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6C0C]" />
                    </motion.div>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Gradient overlays - hidden on mobile for better visibility */}
        <div className="absolute top-0 left-0 h-full w-12 sm:w-16 lg:w-20 bg-linear-to-r from-white to-transparent pointer-events-none hidden sm:block" />
        <div className="absolute top-0 right-0 h-full w-12 sm:w-16 lg:w-20 bg-linear-to-l from-white to-transparent pointer-events-none hidden sm:block" />
      </div>

      {/* Mobile scroll indicators */}
      <div className="flex md:hidden justify-center gap-1.5 mt-3">
        {displayCategories?.slice(0, Math.min(5, displayCategories.length)).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex % 5
                ? "bg-[#FF6C0C] w-6"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryCardSlider;