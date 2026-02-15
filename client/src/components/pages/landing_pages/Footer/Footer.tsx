"use Client";
import React from "react";
import {
  FaFacebookF,
  FaRegCreditCard,
  FaTruck,
  FaYoutube,
} from "react-icons/fa";
import { FaRegMessage, FaRightLeft } from "react-icons/fa6";
import Link from "next/link";
import DownFooter from "../../DownFooter/DownFooter";
import Instagram from "../../../../assets/images/2227.jpg"
import Image from "next/image";

interface FooterProps {
  userCartProducts: {
    cartDetails: any[];
  };
}


const Footer: React.FC<FooterProps> = ({ userCartProducts }) => {
  const quickLink = [
    {
      name: "Shop",
      link: "/shop",
    },
    {
      name: "About Us",
      link: "/about",
    },
    {
      name: "Contact Us",
      link: "/contact",
    },
  ];

  const information = [
    {
      name: "Privacy Policy",
      link: "/privacyPolicy",
    },
    {
      name: "Return Policy",
      link: "/returnPolicy",
    },
    {
      name: "Terms & Condition",
      link: "/terms-condition",
    },
  ];

  return (
    <div className="relative">
      <div className="Container bg-[#F3F3F3]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 lg:justify-center py-5 lg:py-10 px-1 gap-y-4 gap-x-2">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="lg:text-xl text-white bg-primary p-3 rounded-full">
              <FaTruck />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-md lg:text-xl">Free Shipping</div>
              <div className="text-sm text-gray-600">
                Free Shipping for orders
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="lg:text-xl text-white bg-primary p-3 rounded-full">
              <FaRightLeft />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-md lg:text-xl">Return & Exchanges</div>
              <div className="text-sm text-gray-600">
                Free Shipping for orders
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="lg:text-xl text-white bg-primary p-3 rounded-full">
              <FaRegMessage />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-md lg:text-xl">Online Support</div>
              <div className="text-sm text-gray-600">
                24 hours a day, 7 days a week
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="lg:text-xl text-white bg-primary p-3 rounded-full">
              <FaRegCreditCard />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-md lg:text-xl">Flexible payment</div>
              <div className="text-sm text-gray-600">
                Pay with Multiple Credit Cards
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#D9D9D9] py-10 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className=" flex flex-col lg:flex-row justify-between space-y-5">
            <div>
              <div className="text-black font-semibold mb-5 text-xl">
                Contact Info
              </div>
              <div className="text-black text-md lg:text-lg flex flex-col space-y-1">
                <div>WhatsApp: +88 01714-028-279</div>
                <div>Phone: +88 01714-028-279</div>
                <div>email: yousufengineering2024@gmail.com</div>
                <div>Address: 62/B North Pirerbag 60ft Mirpur Dhaka-1216.</div>
              </div>
            </div>
            <div>
              <div className="text-black font-semibold mb-5 text-xl">
                Quick Links
              </div>
              <ul className="text-black text-xl">
                {quickLink.map((item, index) => (
                  <div key={index}>
                    <Link href={item.link}>
                      <li className="my-1 relative group cursor-pointer">
                        <span className="inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:text-black text-md lg:text-lg">
                          {item.name}
                        </span>
                      </li>
                    </Link>
                  </div>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-black font-semibold mb-5 text-xl">
                Infromation
              </div>
              <ul className="text-black text-xl">
                {information.map((item, index) => (
                  <div key={index}>
                    <Link href={item.link}>
                      <li className="my-1 relative group cursor-pointer">
                        <span className="inline-block transition-all duration-300 group-hover:translate-x-2 group-hover:text-black text-md lg:text-lg">
                          {item.name}
                        </span>
                      </li>
                    </Link>
                  </div>
                ))}
              </ul>
            </div>
            <div>
              {/* <div className="text-black font-semibold mb-5 text-xl">
              Social Media
            </div>
            <div className="">
              <div className="flex lg:justify-center lg:items-center gap-2 mt-4">
                <a
                  href="https://www.facebook.com/share/1BfwmV2KcS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-[#2563EB] rounded text-white border border-[#fff]/0 hover:scale-95 hover:border-[#fff] hover:border duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="https://youtube.com/@silkthread-d3v?si=oA7cwongy2QewMZ_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-[#F60000] rounded text-[#fff] border border-[#fff]/0 hover:scale-95 hover:border-[#fff] hover:border duration-300"
                  aria-label="youtube"
                >
                  <FaYoutube />
                </a>

                <a
                  href="https://www.instagram.com/silk3866?igsh=MXJjcWk3ZnBhOTJo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2   hover:scale-95 duration-300"
                  aria-label="Facebook"
                >
                  <Image src={Instagram}
                    width={40}
                    height={40} alt={""} />
                </a>
                <a
                  href="http://tiktok.com/@silk.thread5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-2 bg-black rounded text-white border border-white/0 hover:scale-95 hover:border-white hover:border duration-300"
                  aria-label="tiktok"
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.5 2c.7 0 1.4 0 2 .2 0 2.3 1.8 4.1 4.1 4.2v3.1c-1.5 0-3-.5-4.2-1.4v6.8c0 3.3-2.7 6-6 6S2.5 18.2 2.5 15s2.7-6 6-6c.5 0 1 .1 1.5.2V12c-.5-.2-1-.3-1.5-.3-1.7 0-3 1.4-3 3s1.3 3 3 3 3-1.4 3-3V2z" />
                  </svg>
                </a>
              </div>
            </div> */}
              <iframe
                className="w-full h-full border-none"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d456.34905776821876!2d90.36641156489274!3d23.790403631007976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c0c89187b3bd%3A0x5949ab399ebc916!2sOrganon%20Homeo%20Hall!5e0!3m2!1sen!2sbd!4v1760260755416!5m2!1sen!2sbd"
                title="Yousuf Engineering location"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" bg-[#37383F] text-white text-center py-4 md:pb-4 pb-[80px]">
        <div className="max-w-7xl mx-auto flex justify-between">
          Copyright © 2025 Village Food. All Right Reserved. <div>Developed by{" "}
            <a target="_blank" href="https://okobiz.com/">
              Okobiz
            </a></div>
        </div>
      </div>
      <DownFooter userCartProducts={userCartProducts} />
    </div>
  );
}

export default Footer;
