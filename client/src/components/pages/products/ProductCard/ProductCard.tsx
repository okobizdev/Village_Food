"use client";

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Eye, Check } from 'lucide-react';
import Image from 'next/image';
import { apiBaseUrl } from '@/config/config';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface TProduct {
  _id: string;
  name: string;
  slug: string;
  thumbnailImage: string;
  backViewImage?: string;
  images: string[];
  price: number;
  mrpPrice: number;
  discount: number;
  discountType: string;
  discountAmount: number;
  description: string;
  inventoryType: string;
  inventoryRef: any[];
  mainInventory: number;
  productId: string;
  sizeChartImage?: string;
  videoUrl?: string;
  subCategoryRef?: any;
  freeShipping: boolean;
}

interface HomeProductSectionProps {
  products: {
    category: TProduct;
    result: TProduct[];
  };
  userRef?: string;
  onAddToCart: (data: any) => Promise<any>;
}

// Product Card Component
const ProductCard: React.FC<{ product: TProduct; onQuickAdd: (product: TProduct) => void; onViewDetails: (product: TProduct) => void;}> = ({ product, onQuickAdd, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);
  const hasDiscount = product.discount > 0;
  const isStockOut = product.mainInventory <= 0;
  
  // Get the first image from the images array, fallback to thumbnailImage
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.thumbnailImage;
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isStockOut) {
      onQuickAdd(product);
    }
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onViewDetails(product);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col max-h-80">
      <div className="relative overflow-hidden lg:h-52 md:h-48 h-32">
        <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
          </Link>
          {imageError ? (
            <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">{product.name}</p>
              </div>
            </div>
          ) : (
            <Image 
              src={apiBaseUrl+displayImage} 
              alt={product.name}
              width={160}
              height={200}
              onError={handleImageError}
              className="w-full h-full object-fill transition-transform duration-700 group-hover:scale-110"
            />
          )}
          
          {/* Stock Out Ribbon */}
          {isStockOut && (
            <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden pointer-events-none z-20">
              <div className="bg-[#FF6C0C] text-white font-bold text-[10px] px-8 py-1 -rotate-45 shadow-lg transform -translate-x-6 translate-y-3 text-center">
                STOCK OUT
              </div>
            </div>
          )}

          {/* Stock Out Overlay */}
          {isStockOut && (
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px] z-10"></div>
          )}
          
          {hasDiscount && !isStockOut && (
            <div className="absolute top-2 left-2 bg-linear-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg z-10">
              {product.discountType === 'percentage' ? `${product.discount}% OFF` : `৳${product.discountAmount} OFF`}
            </div>
          )}
          
          {product.freeShipping && !isStockOut && (
            <div className="absolute top-2 right-2 bg-linear-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg z-10">
              Free Ship
            </div>
          )}
          
          {/* Hover Actions */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2 gap-2 z-30">
            <button 
              onClick={handleViewDetailsClick}
              className="p-2 bg-white text-gray-800 rounded-full hover:bg-[#FF6C0C] hover:text-white transition-all shadow-lg transform hover:scale-110"
              title="Quick View"
            >
              <Eye size={16} strokeWidth={2} />
            </button>
            {!isStockOut && (
              <button 
                onClick={handleQuickAddClick}
                className="p-2 bg-[#FF6C0C] text-white rounded-full hover:bg-[#E55A00] transition-all shadow-lg transform hover:scale-110"
                title="Add to Cart"
              >
                <ShoppingCart size={16} strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
        
        <div className="p-0.5 flex flex-col grow">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-800 mb-0.5 line-clamp-2 text-xs leading-tight">
              {product.name}
            </h3>
    
          
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            <span className="text-base font-bold text-gray-900">৳{product.price}</span>
            {hasDiscount && (
              <>
                <span className="text-[10px] line-through text-gray-400">৳{product.mrpPrice}</span>
              </>
            )}
          </div>
          </Link>
          <button 
            onClick={handleQuickAddClick}
            disabled={isStockOut}
            className={`w-full py-1.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-1.5 font-semibold text-xs shadow-md transform ${
              isStockOut 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-linear-to-r from-[#FF6C0C] to-[#E55A00] text-white hover:from-[#E55A00] hover:to-[#CC4F00] hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isStockOut ? (
              <>
                <X size={16} strokeWidth={2.5} />
                স্টক আউট
              </>
            ) : (
              <>
                <ShoppingCart size={16} strokeWidth={2.5} />
                অর্ডার করুন
              </>
            )}
          </button>
        </div>
    </div>
  );
};

// Category Banner Card - Matches ProductBannerCard style
const CategoryBannerCard: React.FC<{ product: TProduct }> = ({ product }) => {
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

// Modal Component
const AddToCartModal: React.FC<{ 
  product: TProduct | null; 
  isOpen: boolean; 
  onClose: () => void;
  onConfirm: (quantity: number, inventoryRef?: string) => void;
  isLoading: boolean;
}> = ({ product, isOpen, onClose, onConfirm, isLoading }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedInventory, setSelectedInventory] = useState<string>("");
  
  if (!isOpen || !product) return null;
  
  const hasDiscount = product.discount > 0;
  const totalPrice = product.price * quantity;
  const totalMrp = product.mrpPrice * quantity;
  const totalSavings = (product.mrpPrice - product.price) * quantity;
  const hasInventoryOptions = (product.inventoryType === 'colorLevelInventory' || product.inventoryType === 'levelInventory' || product.inventoryType === 'colorInventory') && product.inventoryRef?.length > 0;
  
  const modalImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.thumbnailImage;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl animate-scale-in overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-[#FF6C0C] to-[#E55A00] p-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingCart size={24} />
            Add to Cart
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="w-24 h-24 shrink-0 bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={apiBaseUrl + modalImage} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1 leading-tight text-sm">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2 font-mono bg-white px-2 py-0.5 rounded inline-block">
                ID: {product.productId}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-bold text-[#FF6C0C]">৳{product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-gray-400">৳{product.mrpPrice}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {product.discountType === 'percent' ? `${product.discount}% OFF` : `৳${product.discountAmount} OFF`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {hasInventoryOptions && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {product.inventoryType === 'levelInventory' ? 'সাইজ নির্বাচন করুন' : 
                 product.inventoryType === 'colorInventory' ? 'কালার নির্বাচন করুন' : 
                 'সাইজ ও কালার নির্বাচন করুন'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.inventoryRef.map((item: any) => {
                  const isOutOfStock = item.quantity === 0 || item.quantity < 0;
                  
                  let displayValue = 'Option';
                  
                  if (product.inventoryType === 'levelInventory') {
                    displayValue = item.level || item.size || 'Size';
                  } else if (product.inventoryType === 'colorInventory') {
                    displayValue = item.name || 'Color';
                  } else if (product.inventoryType === 'colorLevelInventory') {
                    const colorName = item.name || 'Color';
                    const sizeName = item.level || item.size || 'Size';
                    displayValue = `${colorName} - ${sizeName}`;
                  }
                  
                  return (
                    <button
                      key={item._id}
                      onClick={() => !isOutOfStock && setSelectedInventory(item._id)}
                      disabled={isOutOfStock}
                      className={`p-2 rounded-lg border-2 transition-all text-xs font-semibold ${
                        selectedInventory === item._id 
                          ? 'border-[#FF6C0C] bg-orange-50 text-[#FF6C0C]' 
                          : isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          : 'border-gray-200 hover:border-[#FF6C0C] hover:bg-orange-50 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold uppercase">{displayValue}</span>
                        {item.quantity !== undefined && (
                          <span className={`text-xs mt-0.5 ${isOutOfStock ? 'text-red-500' : 'text-gray-500'}`}>
                            {isOutOfStock ? 'Stock Out' : `${item.quantity} টি`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                disabled={quantity <= 1}
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <span className="text-2xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.mainInventory, quantity + 1))}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                disabled={quantity >= product.mainInventory}
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-sm font-bold text-green-600">{product.mainInventory} units</p>
              </div>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-lg p-4 mb-4 border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({quantity} items)</span>
                <span className="font-bold text-gray-900">৳{totalPrice}</span>
              </div>
              {hasDiscount && (
                <>
                  <div className="flex justify-between text-sm text-gray-400 line-through">
                    <span>Original Price</span>
                    <span>৳{totalMrp}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-green-600 bg-green-50 -mx-2 px-2 py-1 rounded">
                    <span>You Save</span>
                    <span>৳{totalSavings}</span>
                  </div>
                </>
              )}
              {product.freeShipping && (
                <div className="flex justify-between text-sm font-bold text-green-600 pt-2 border-t border-gray-200">
                  <span>Shipping</span>
                  <span className="flex items-center gap-1">
                    <Check size={16} />
                    FREE
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#FF6C0C] pt-3 border-t-2 border-gray-300">
                <span>Total</span>
                <span>৳{totalPrice}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onConfirm(quantity, selectedInventory || undefined)}
            disabled={isLoading || (hasInventoryOptions && !selectedInventory)}
            className="w-full bg-linear-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Adding...
              </>
            ) : (
              <>
                <Check size={20} strokeWidth={2.5} />
                Confirm & Add to Cart
              </>
            )}
          </button>
          
          {hasInventoryOptions && !selectedInventory && (
            <p className="text-center text-sm text-red-500 mt-3 font-semibold">
              অনুগ্রহ করে {product.inventoryType === 'levelInventory' ? 'সাইজ' : 
                           product.inventoryType === 'colorInventory' ? 'কালার' : 
                           'সাইজ/কালার'} নির্বাচন করুন
            </p>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

// Main Component
const HomeProductSection: React.FC<HomeProductSectionProps> = ({ products, userRef, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleQuickAdd = (product: TProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleConfirmCart = async (quantity: number, inventoryRef?: string) => {
    if (!selectedProduct) return;
    
    setIsLoading(true);
    
    try {
      const cartData = {
        productRef: selectedProduct._id,
        quantity: quantity,
        userRef: userRef,
        inventoryRef: inventoryRef || null
      };
      
      await onAddToCart(cartData);
      
      setIsModalOpen(false);
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const displayProducts = products?.result?.slice(0, 8) || [];

  return (

<div>

  
      <div className="container mx-auto px-4 lg:px-10  ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:grid-rows-2 gap-2  mt-4">
        {/* Category Banner - Takes 2 columns and 2 rows on lg */}
        <div className="col-span-2 row-span-2 min-h-[300px] lg:min-h-[400px]">
          {products?.category && (
            <CategoryBannerCard product={products.category} />
          )}
        </div>
        
        {/* Product Cards - 8 cards in remaining space */}
        {displayProducts.map((product) => (
          <ProductCard 
            key={product._id}
            product={product}
            onQuickAdd={handleQuickAdd} onViewDetails={function (product: TProduct): void {
              console.log(product)
              throw new Error('Function not implemented.');
            } }          />
        ))}
      </div>
      
      <AddToCartModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCart}
        isLoading={isLoading}
      />
    </div>
</div>
  );
};

export default HomeProductSection;