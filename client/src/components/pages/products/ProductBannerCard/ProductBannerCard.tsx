import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { apiBaseUrl } from "@/config/config";
import { TProduct } from "../ProductCard/types";
// Category Banner Card - Matches ProductBannerCard style
export const CategoryBannerCard: React.FC<{ product: TProduct }> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  
  // Use bannerImage if available, otherwise fallback to images array or thumbnailImage
  const displayImage = (product as any).bannerImage || 
    (product.images && product.images.length > 0 ? product.images[0] : product.thumbnailImage);

  return (
    <div className="w-full h-full relative group overflow-hidden">
      <Link href={`/shop?subCategory=${product.slug || product._id}`} className="block h-full relative">
        <div className="relative h-full rounded-lg overflow-hidden">
          {imageError ? (
            <div className="w-full h-full bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center">
              <div className="text-center p-4">
                <ShoppingCart size={64} className="mx-auto text-orange-400 mb-3" />
                <p className="text-lg font-semibold text-gray-700">{product.name}</p>
              </div>
            </div>
          ) : (
            <Image 
              src={apiBaseUrl + displayImage} 
              alt={product.name}
              fill
              onError={() => setImageError(true)}
              className="object-cover rounded transition-transform duration-300 group-hover:scale-105"
            />
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/15 w-full rounded"></div>
          
          {/* Bottom Title with hover effect */}
          <div className="bottom-0 absolute w-full text-center group-hover:bg-[#99C9F7]/20 group-hover:border-t border-white/30 rounded-b text-white z-50 duration-300">
            <h2 className="py-2 text-2xl capitalize font-semibold">{product.name}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
};