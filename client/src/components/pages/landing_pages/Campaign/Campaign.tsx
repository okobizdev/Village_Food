"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TCampaign } from "@/types/campaign";

interface Props {
  campaign: TCampaign;
}
const Campaign: React.FC<Props> = ({ campaign }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!campaign?.couponRef?.expireDate) return;

    const targetDate = new Date(campaign.couponRef.expireDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // clearInterval(interval);
        setTimeLeft({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      const days = String(
        Math.floor(difference / (1000 * 60 * 60 * 24))
      ).padStart(2, "0");
      const hours = String(
        Math.floor((difference / (1000 * 60 * 60)) % 24)
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((difference / (1000 * 60)) % 60)
      ).padStart(2, "0");
      const seconds = String(Math.floor((difference / 1000) % 60)).padStart(
        2,
        "0"
      );

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer(); // run once immediately
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [campaign]);

  return (
    <div className="max-w-7xl mx-auto pb-8 py-4">
      <div className="grid md:grid-cols-2 rounded">
        <div className="flex flex-col items-center justify-center bg-green-700 md:rounded-l rounded-t">
          <div className="text-center lg:pb-8 pb-4 text-[#fff]">
            <p className="md:mt-0 mt-3">Special Offer</p>
            <h2 className="lg:text-2xl text-xl font-semibold mt-1">
              {campaign?.name || "Upcoming Campaign"}
            </h2>
          </div>
          <div className="flex gap-4 text-center text-[#fff]">
            <div className="border border-[#fff] lg:p-4 p-2 rounded-lg">
              <span className="lg:text-2xl text-xl font-bold">
                {timeLeft.days}
              </span>
              <div className="text-sm">Days</div>
            </div>
            <div className="border border-[#fff] lg:p-4 p-2 rounded-lg">
              <span className="lg:text-2xl text-xl font-bold">
                {timeLeft.hours}
              </span>
              <div className="text-sm">Hours</div>
            </div>
            <div className="border border-[#fff] lg:p-4 p-2 rounded-lg">
              <span className="lg:text-2xl text-xl font-bold">
                {timeLeft.minutes}
              </span>
              <div className="text-sm">Minutes</div>
            </div>
            <div className="border border-[#fff] lg:p-4 p-2 rounded-lg">
              <span className="lg:text-2xl text-xl font-bold">
                {timeLeft.seconds}
              </span>
              <div className="text-sm">Seconds</div>
            </div>
          </div>

          <div className="my-8">
            <Link href="/shop">
              <button className="px-8 py-3 bg-white text-gray-800 text-lg font-bold rounded cursor-pointer border border-[#fff]/0 hover:border-[#fff] duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
        <div className=" relative h-[300px] md:h-[500px]">
          <Image
            src="/assets/images/timer.webp"
            alt="Countdown Timer"
            fill
            className="w-full h-full object-fill md:rounded-r rounded-b"
          />
        </div>
      </div>
    </div>
  );
};

export default Campaign;
