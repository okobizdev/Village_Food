"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import SearchCancel from "./SearchCancel";
import { getAllProductsForShop } from "@/services/products";
import Lottie from "lottie-react";


import { ProductCard } from "../ProductCard/ProductCard";
import { AddToCartModal } from "../AddToCartModal/AddToCartModal";
import { toast } from "react-toastify";
import { TProduct } from "@/types/product";
import { useSearchParams } from "next/navigation";

interface Pagination {
  currentPage: number;
  currentPageLimit: number;
  total: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
}

interface ShopProductsProps {
  products: TProduct[];
  pagination: Pagination;
  categorySlug: string;
  subCategorySlug: string;
  childCategorySlug: string;
  userRef?: string;
  onAddToCart: (data: any) => Promise<any>;
}

const ShopProducts: React.FC<ShopProductsProps> = ({
  products,
  pagination,
  categorySlug,
  subCategorySlug,
  childCategorySlug,
  userRef,
  onAddToCart,
}) => {
  const [allProducts, setAllProducts] = useState<TProduct[]>(products);
  const [currentPage, setCurrentPage] = useState(pagination.currentPage);
  const [hasMore, setHasMore] = useState(pagination.nextPage !== null);
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();


  const fetchMoreProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { data } = await getAllProductsForShop(
        categorySlug,
        subCategorySlug,
        childCategorySlug,
        searchParams.get("minPrice") || "",
        searchParams.get("maxPrice") || "",
        currentPage + 1,
        9
      );

      if (data?.result?.length === 0) {
        setHasMore(false);
        return;
      }

      if (data.pagination.currentPage === currentPage) {
        setHasMore(false);
        return;
      }

      const newProducts = data.result.filter(
        (newProduct: TProduct) => !allProducts.some(
          (existingProduct) => existingProduct._id === newProduct._id
        )
      );

      if (newProducts.length === 0) {
        setHasMore(false);
        return;
      }

      setAllProducts((prev) => [...prev, ...data.result]);
      setCurrentPage(data.pagination.currentPage);
      setHasMore(data.pagination.nextPage !== null);
    } catch (error) {
      console.error("Error fetching more products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    currentPage,
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    allProducts,
  ]);

  const handleQuickAdd = (product: TProduct) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const handleConfirm = async (quantity: number, inventoryRef?: string) => {
    if (!selectedProduct) return;

    try {
      setLoading(true);
      await onAddToCart({
        productRef: selectedProduct._id,
        quantity,
        inventoryRef,
        userRef,
      });
      toast.success("Added to cart");
      setIsOpen(false);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setAllProducts(products);
    setCurrentPage(pagination.currentPage);
    setHasMore(pagination.nextPage !== null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [products, pagination, categorySlug, subCategorySlug, childCategorySlug]);

  useEffect(() => {
    let mounted = true;
    fetch('/assets/animation/shop-page-loading.json')
      .then((res) => res.json())
      .then((data) => {
        if (mounted) setAnimationData(data);
      })
      .catch((err) => {
        console.error('Failed to load animation JSON', err);
      });
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [
    categorySlug,
    subCategorySlug,
    childCategorySlug,
    fetchMoreProducts,
    hasMore,
  ]);

  return (
    <div className="p-4 2xl:px-0">
      <div className="pb-4">
        <SearchCancel />
      </div>

      {allProducts?.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10 col-span-full">
          No products available for now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
          ))}
        </div>
      )}

      {loading && animationData && (
        <div className="flex justify-center py-4">
          <div className="w-24 h-24">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </div>
      )}

      {/* Modal */}
      <AddToCartModal
        product={selectedProduct}
        isOpen={isOpen}
        isLoading={loading}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
      />

      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default ShopProducts;
