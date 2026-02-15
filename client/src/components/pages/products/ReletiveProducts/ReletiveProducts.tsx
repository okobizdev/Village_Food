'use client'

import { TProduct } from "@/types/product";
import HomeProductSection from "../HomeProductSection/HomeProductSection";
import { addToCart } from "@/services/cart";


interface Products {
  userRef?: string;
  relativeProducts: TProduct[];
}

const ReletiveProducts: React.FC<Products> = ({ relativeProducts, userRef }) => {


  return (
    <div className="mt-2 max-w-7xl mx-auto">
      <div className="mt-8 w-full">
        <HomeProductSection
          products={relativeProducts || []}
          title="Related Products"
          type="popular"
          onAddToCart={addToCart}
          userRef={userRef}
        />
      </div>

    </div>
  );
};

export default ReletiveProducts;
