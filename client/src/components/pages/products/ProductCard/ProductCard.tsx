"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TProduct } from "../../../../types/product";
import { ShoppingCart } from "lucide-react";

export const ProductCard: React.FC<{ product: TProduct; onQuickAdd: (product: TProduct) => void }> = ({ product, onQuickAdd }) => {
  const [imageError, setImageError] = useState(false);
  const hasDiscount = product?.discount > 0;
  const router = useRouter();

  // Get the first image from the images array, fallback to thumbnailImage
  const displayImage = product?.images && product?.images?.length > 0
    ? product?.images[0]
    : product?.thumbnailImage;

  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd(product);
  };

  return (
    <div
      onClick={() => router.push(`/product/${product.slug}`)} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group border border-gray-100 flex flex-col cursor-pointer ">
      <div className="relative overflow-hidden lg:h-60 md:h-48 h-32">
        {imageError ? (
          <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">{product?.name}</p>
            </div>
          </div>
        ) : (
          <div className="h-[220px] w-full">
            <Image
              src={displayImage}
              alt={product?.name}
              fill
              onError={handleImageError}
              className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-110 rounded-md"
            />
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-linear-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg z-10">
            {product?.discountType === 'percentage' ? `${product?.discount}% OFF` : `৳${product?.discountAmount} OFF`}
          </div>
        )}

        {product?.freeShipping && (
          <div className="absolute top-2 right-2 bg-linear-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg z-10">
            Free Ship
          </div>
        )}

      </div>

      <div className="p-0.5 flex flex-col grow mt-5 px-3 pb-3 text-center">
        <h3 className="font-semibold text-gray-800  line-clamp-1 text-xl leading-tight mb-2">
          {product?.name}
        </h3>
        <div className="flex items-center  justify-center gap-3 mb-2 text-center">
          <span className="text-lg font-bold text-gray-900 text-center">৳{product?.price}</span>
          {hasDiscount && (
            <>
              <span className="text-[12px] line-through text-gray-400 text-center">৳{product?.mrpPrice}</span>
            </>
          )}
        </div>
        <button
          onClick={handleQuickAddClick}
          className="relative w-full h-10 lg:h-12 overflow-hidden rounded-sm
             bg-primary text-white shadow-md
             transition-all duration-300
             mt-auto group/button cursor-pointer "
        >
          {/* Normal State (Text + Icon) */}
          <div
            className="absolute inset-0 flex items-center justify-center gap-2
               transition-all duration-300
               group-hover/button:-translate-y-full"
          >
            <ShoppingCart size={16} strokeWidth={2.5} />
            <span className="font-semibold text-lg">Add to Cart</span>
          </div>

          {/* Hover State (Only Icon from Bottom) */}
          <div
            className="absolute inset-0 flex items-center justify-center
               bg-green-700
               translate-y-full
               transition-all duration-300
               group-hover/button:translate-y-0"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
          </div>
        </button>

      </div>
    </div>
  );
};
