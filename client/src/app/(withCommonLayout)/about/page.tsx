import React from "react";
import aboutImage from "@/assets/logo/logo_hd_large.png";
import Image from "next/image";
// import NavBar from "@/components/pages/header/NavBar/NavBar";
// import { getCartProducts } from "@/services/cart";
// import { getUser } from "@/services/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Silk Thread | About",
  description: "Best E-commerce platform in BD",
};

const page = async () => {
  // const user = await getUser();
  // const userRef = user?.id;
  // const coupon = "";
  // const userCartProducts = await getCartProducts(userRef, coupon);
  return (
<section className="bg-white py-12 mt-16 ">
  <div className="container mx-auto px-4 lg:px-8">
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="w-full lg:w-1/3">
        <Image 
          src={aboutImage}
          alt="Silk Thread apparel — shirts and polos"
          className="w-full h-auto rounded-lg shadow-sm object-cover"
        />
      </div>

      <div className="w-full lg:w-2/3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Silk Thread — Redefining Everyday Style
        </h1>

        <p className="mt-4 text-gray-700 leading-relaxed policy-page-text">
          Silk Thread is a modern e-commerce brand dedicated to delivering
          high-quality, stylish, and comfortable apparel for everyday wear.
          Specializing in premium shirts, polos, and casual essentials, we
          combine contemporary design with expert craftsmanship to create pieces
          that elevate your wardrobe with effortless confidence.
        </p>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Premium fabrics &amp; durable construction
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Versatile styles: shirts, polos, casual staples
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Thoughtful fits for everyday comfort
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 111.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Affordable quality &amp; seamless online shopping
          </li>
        </ul>

        <p className="mt-6 text-gray-600">
          Driven by a passion for design and customer satisfaction, Silk Thread
          continually expands its collections with fresh colors, modern cuts,
          and dependable basics — all backed by hassle-free shipping and easy
          returns.
        </p>

        <div className="mt-6 flex gap-4">
          <a
            href="/shop"
            className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-lg shadow hover:opacity-95"
            aria-label="Shop Silk Thread collections"
          >
            Shop Collections
          </a>
          <a
            href="/about"
            className="inline-block px-6 py-3 border border-gray-300 text-gray-800 font-medium rounded-lg"
            aria-label="Learn more about Silk Thread"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  </div>
</section>


  );
};

export default page;
