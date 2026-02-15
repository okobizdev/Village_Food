

import { addToCart } from "@/services/cart";
import { getUser } from "@/services/auth";
import HomeProductSection from "../../products/HomeProductSection/HomeProductSection";
import { TProduct } from "@/types/product";

interface ProductsProps {
  products: TProduct[];
  title: string;
  type: "bestDeal" | "bestSeller" | "popular";
}


const HomeProducts = async ({ title, products, type }: ProductsProps) => {
  const user = await getUser();

  return (
    <div className="pb-12 px-4 md:px-6 lg:px-8 2xl:px-0">
      <HomeProductSection
        products={products}
        title={title}
        type={type}
        userRef={user?.id}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default HomeProducts;
