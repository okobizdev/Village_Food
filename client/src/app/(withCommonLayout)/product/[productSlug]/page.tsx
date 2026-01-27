// import NavBar from "@/components/pages/header/NavBar/NavBar";
// import { getCartProducts } from "@/services/cart";

import ProductDetails from "@/components/pages/products/ProductDetails/ProductDetails";
import ProductReview from "@/components/pages/products/ProductReview/ProductReview";
import ReletiveProducts from "@/components/pages/products/ReletiveProducts/ReletiveProducts";
import { getUser } from "@/services/auth";

import {
  getRelativeProducts,
  getSingleProductBySlug,
} from "@/services/products";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "SilkThread | Single Product",
  description: "Best E-commerce platform in BD",
};

interface PageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const { data: product } = await getSingleProductBySlug(
    resolvedParams.productSlug
  );
console.log("product===========>",product);
console.log("resolvedParams===========>",resolvedParams);

  const user = await getUser();
  const userRef = user?.id;

  const productId = product?._id;

  const { data: relativeProducts } = await getRelativeProducts(productId);

  // ==================== Product Details ====================
  // const coupon = "";
  // const userCartProducts = await getCartProducts(userRef, coupon);

  return (
    <div className="">
      {/* <NavBar userCartProducts={userCartProducts?.data} /> */}
      <ProductDetails product={product} />
      <ProductReview userRef={userRef} productRef={productId} />
      <ReletiveProducts relativeProducts={relativeProducts} />
    </div>
  );
};

export default Page;
