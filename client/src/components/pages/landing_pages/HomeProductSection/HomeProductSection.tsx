import { TProduct } from "@/types";

import { addToCart } from "@/services/cart";
// import MainProduct from "../../products/ProductCard/ProductCard";
import HomeProductSection from "../../products/ProductCard/ProductCard";
import { getUser } from "@/services/auth";
interface ProductsProps {
  products: {
    category: TProduct;
    result: TProduct[];
  };
}


const HomeProducts = async ({ products}: ProductsProps) => {
  const user = await getUser();
console.log("HomeProducts products:", products);
  return (
    <div>
      <HomeProductSection
        products={products}
        userRef={user?.id}
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default HomeProducts;
