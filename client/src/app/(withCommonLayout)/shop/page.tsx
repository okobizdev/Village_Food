import ShopProducts from "@/components/pages/products/ShopProducts/ShopProducts";
import ShopProductsCategories from "@/components/pages/products/ShopProductsCategories/ShopProductsCategories";
import { getShopSidebar } from "@/services/shopSidebar";
import { getAllProductsForShop } from "@/services/products";
import { getUser } from "@/services/auth";
import { addToCart, getCartProducts } from "@/services/cart";
import CartSideBar from "@/components/pages/cartSideBar/CartSideBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Village Food | All Products - Fresh Organic Food",
  description: "Browse our complete collection of organic products - oils, fruits, vegetables, and more. Farm fresh quality delivered to your door.",
};

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { data: shopSideBar } = await getShopSidebar();


  // Extract filter params
  const categorySlug = Array.isArray(params.category)
    ? params.category[0]
    : params.category || "";

  const subCategorySlug = Array.isArray(params.subCategory)
    ? params.subCategory[0]
    : params.subCategory || "";

  const childCategorySlug = Array.isArray(params.childCategory)
    ? params.childCategory[0]
    : params.childCategory || "";

  // Extract price params
  const minPrice = Array.isArray(params.minPrice)
    ? params.minPrice[0]
    : params.minPrice || "";

  const maxPrice = Array.isArray(params.maxPrice)
    ? params.maxPrice[0]
    : params.maxPrice || "";

  // Extract pagination params
  const page = Array.isArray(params.page)
    ? parseInt(params.page[0])
    : params.page
      ? parseInt(params.page as string)
      : 1;

  const limit = Array.isArray(params.limit)
    ? parseInt(params.limit[0])
    : params.limit
      ? parseInt(params.limit as string)
      : 9;


  // Fetch products with all filters
  const { data: products } = await getAllProductsForShop(
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    minPrice,
    maxPrice,
    page,
    limit
  );

  // Get user and cart
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const cartProducts = await getCartProducts(userId, coupon);

  // Sort by priority
  const sortedData = [...products.result].sort((a, b) =>
    a.priority === b.priority ? 0 : a.priority ? -1 : 1
  );

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mt-20 px-4">
        {/* Sidebar - Categories & Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <ShopProductsCategories shopSideBar={shopSideBar} />
        </div>

        {/* Main Products Area */}
        <div className="col-span-1 lg:col-span-3">
          <ShopProducts
            products={sortedData}
            pagination={products.pagination}
            categorySlug={categorySlug}
            subCategorySlug={subCategorySlug}
            childCategorySlug={childCategorySlug}
            userRef={userId}
            onAddToCart={addToCart}
          />
        </div>
        {/* Cart Sidebar */}
        <CartSideBar cartProducts={cartProducts?.data} />
      </div>
    </div>
  );
}