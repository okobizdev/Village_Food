import ProductDetails from "@/components/pages/products/ProductDetails/ProductDetails";
import ProductReview from "@/components/pages/products/ProductReview/ProductReview";
import ReletiveProducts from "@/components/pages/products/ReletiveProducts/ReletiveProducts";
import { getUser } from "@/services/auth";

import {
  getRelativeProducts,
  getSingleProductBySlug,
} from "@/services/products";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Village food | Single Product",
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


  const user = await getUser();
  const userRef = user?.id;

  const productId = product?._id;

  const { data: relativeProducts } = await getRelativeProducts(productId);


  return (
    <div className="">
      <ProductDetails product={product} />
      <ReletiveProducts relativeProducts={relativeProducts} userRef={userRef} />
      <ProductReview userRef={userRef} productRef={productId} />
    </div>
  );
};

export default Page;
