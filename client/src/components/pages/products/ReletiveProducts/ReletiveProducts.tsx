'use client'
import { rajdhani } from "@/app/font";
import ProductCard from "../ProductCard/ProductCard";
import { TProduct } from "@/types";
import React from "react";

interface Products {
  relativeProducts: TProduct[];
}

const ReletiveProducts: React.FC<Products> = async ({ relativeProducts }) => {
  return (
    <div className="my-12 Container">
      <h2
        className={`text-xl font-semibold border-b pb-3 ${rajdhani.className}`}
      >
        Related Products :
      </h2>

      <div className=" mt-8">
        {relativeProducts?.slice(0, 12).map((product) => (
          <ProductCard key={product._id} products={{ category: product, result: [product] }} onAddToCart={async () => {}} />
        ))}
      </div>
    </div>
  );
};

export default ReletiveProducts;
