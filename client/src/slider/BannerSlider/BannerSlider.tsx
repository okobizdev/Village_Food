"use client";

import React, { useEffect, useRef, useState } from "react";
import { TBanner } from "@/types";
import gsap from "gsap";

interface BannerProps {
  banners: TBanner[];
}

const BannerSlider: React.FC<BannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const stripsRef = useRef<(HTMLDivElement | null)[][]>([]);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const STRIPS = 5; // 5টা vertical strip

  // Initialize slides and strips
  useEffect(() => {
    if (banners.length === 0) return;

    slidesRef.current.forEach((slide, index) => {
      if (!slide) return;

      if (index === currentIndex) {
        gsap.set(slide, {
          opacity: 1,
          zIndex: 2,
          display: "block",
        });

        // Set strips to normal position for current slide
        const strips = stripsRef.current[index];
        if (strips) {
          strips.forEach((strip) => {
            if (strip) {
              gsap.set(strip, { x: "0%", opacity: 1 });
            }
          });
        }
      } else {
        gsap.set(slide, {
          opacity: 0,
          zIndex: 1,
          display: "none",
        });

        // Set strips to right position for other slides
        const strips = stripsRef.current[index];
        if (strips) {
          strips.forEach((strip) => {
            if (strip) {
              gsap.set(strip, { x: "100%", opacity: 1 });
            }
          });
        }
      }
    });
  }, [currentIndex, banners.length]);

  // Animate first slide on mount
  useEffect(() => {
    if (banners.length === 0) return;

    const firstSlideStrips = stripsRef.current[0];
    if (!firstSlideStrips) return;

    // Set initial position off-screen
    firstSlideStrips.forEach((strip) => {
      if (strip) {
        gsap.set(strip, { x: "100%" });
      }
    });

    // Animate in
    const timeline = gsap.timeline({ delay: 0.3 });
    firstSlideStrips.forEach((strip, i) => {
      if (!strip) return;
      timeline.to(
        strip,
        {
          x: "0%",
          duration: 0.6,
          ease: "power2.out",
        },
        i * 0.1
      );
    });
  }, []);

  // Animate slide transition with vertical strips from right
  const animateSlide = (newIndex: number) => {
    if (isAnimating || newIndex === currentIndex || banners.length <= 1) return;
    setIsAnimating(true);

    const nextSlide = slidesRef.current[newIndex];
    if (!nextSlide) return;

    // Show next slide
    gsap.set(nextSlide, { display: "block", zIndex: 2, opacity: 1 });

    const strips = stripsRef.current[newIndex];

    // Set initial position - all strips off-screen to the right
    if (strips) {
      strips.forEach((strip) => {
        if (strip) {
          gsap.set(strip, {
            x: "100%", // Start from right side, completely off-screen
            opacity: 1
          });
        }
      });
    }

    // Animate strips coming from right, one by one
    const timeline = gsap.timeline({
      onComplete: () => {
        // Hide old slide
        slidesRef.current.forEach((slide, idx) => {
          if (idx !== newIndex && slide) {
            gsap.set(slide, { display: "none", opacity: 0 });
          }
        });

        setCurrentIndex(newIndex);
        setIsAnimating(false);
      },
    });

    if (strips) {
      strips.forEach((strip, i) => {
        if (!strip) return;

        // Each strip slides in from right, with stagger delay
        timeline.to(
          strip,
          {
            x: "0%", // Slide to original position
            duration: 0.6,
            ease: "power2.out",
          },
          i * 0.1 // Stagger: each strip starts 0.1s after previous
        );
      });
    }
  };

  // Auto-play functionality
  useEffect(() => {
    if (banners.length <= 1) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        const nextIndex = (currentIndex + 1) % banners.length;
        animateSlide(nextIndex);
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [currentIndex, banners.length]);

  const handleDotClick = (index: number) => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
    animateSlide(index);
  };

  if (banners.length === 0) {
    return <div className="text-center py-20">No banners available</div>;
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Banner Container */}
      <div className="relative 2xl:h-[600px] xl:h-[450px] md:h-[350px] h-[200px] w-full bg-gray-100">
        {banners.map((banner, slideIndex) => (
          <div
            key={banner._id}
            ref={(el) => {
              slidesRef.current[slideIndex] = el;
            }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Create vertical strips using clip-path */}
            <div className="absolute inset-0 w-full h-full flex">
              {Array.from({ length: STRIPS }).map((_, stripIndex) => {
                if (!stripsRef.current[slideIndex]) {
                  stripsRef.current[slideIndex] = [];
                }

                const stripWidth = 100 / STRIPS; // Each strip is 20%
                const leftPosition = stripIndex * stripWidth; // 0%, 20%, 40%, 60%, 80%

                return (
                  <div
                    key={stripIndex}
                    ref={(el) => {
                      stripsRef.current[slideIndex][stripIndex] = el;
                    }}
                    className="absolute top-0 h-full"
                    style={{
                      width: `${stripWidth}%`,
                      left: `${leftPosition}%`,
                      overflow: "hidden",
                    }}
                  >
                    {/* Full image positioned so each strip shows correct portion */}
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${banner.image})`,
                        backgroundSize: `${STRIPS * 100}% 100%`, // 500% width
                        backgroundPosition: `${(stripIndex / (STRIPS - 1)) * 100}% 0%`, // Correct position
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              disabled={isAnimating}
              className={`transition-all duration-300 ${index === currentIndex
                  ? "w-8 h-2 bg-white rounded-full"
                  : "w-2 h-2 bg-white/60 rounded-full hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;