"use client";

import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus,  Eye, Check } from 'lucide-react';
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

interface ProductListClientProps {
  products: TProduct[];
  title?: string;
  subtitle?: string;
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
          </Link>
          
          <div className="flex items-center gap-1 mb-0.5 flex-wrap">
            <span className="text-base font-bold text-gray-900">৳{product.price}</span>
            {hasDiscount && (
              <>
                <span className="text-[10px] line-through text-gray-400">৳{product.mrpPrice}</span>
              </>
            )}
          </div>
          
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
// Modal Component add to cart
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
  
  // Get the first image from the images array for modal, fallback to thumbnailImage
  const modalImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : product.thumbnailImage;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-sm shadow-2xl animate-scale-in overflow-hidden mb-32 " 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-[#FF6C0C] to-[#E55A00] lg:p-4 p-2 flex items-center justify-between">
          <h2 className="lg:text-xl text=lg font-bold text-white flex items-center gap-1">
            <ShoppingCart size={28} />
            Add to Cart
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
        
        <div className="lg:p-2  p-1  overflow-y-auto">
          <div className="flex gap-2 mb-2 bg-gray-50 p-2 rounded-xl">
            <div className="w-28 h-28 shrink-0 bg-white rounded-lg overflow-hidden shadow-md">
              <img 
                src={apiBaseUrl + modalImage} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1 leading-tight">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2 font-mono bg-white px-2 py-0.5 rounded inline-block">
                ID: {product.productId}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className=" text-lg  lg:font-bold font-semibold text-[#FF6C0C]">৳{product.price}</span>
                {hasDiscount && (
                  <>
                    <span className="text-sm line-through text-gray-400">৳{product.mrpPrice}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {product.discountType === 'percentage' ? `${product.discount}% OFF` : `৳${product.discountAmount} OFF`}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {hasInventoryOptions && (
            <div className="lg:mb-3 mb-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {product.inventoryType === 'levelInventory' ? 'সাইজ নির্বাচন করুন' : 
                 product.inventoryType === 'colorInventory' ? 'কালার নির্বাচন করুন' : 
                 'সাইজ ও কালার নির্বাচন করুন'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {product.inventoryRef.map((item: any) => {
                  const isOutOfStock = item.quantity === 0 || item.quantity < 0;
                  
                  // Extract display value based on inventoryType
                  let displayValue = 'Option';
                  
                  if (product.inventoryType === 'levelInventory') {
                    // Show only size/level
                    displayValue = item.level || item.size || 'Size';
                  } else if (product.inventoryType === 'colorInventory') {
                    // Show only color name
                    displayValue = item.name || 'Color';
                  } else if (product.inventoryType === 'colorLevelInventory') {
                    // Show both color name and size
                    const colorName = item.name || 'Color';
                    const sizeName = item.level || item.size || 'Size';
                    displayValue = `${colorName} - ${sizeName}`;
                  }
                  
                  return (
                    <button
                      key={item._id}
                      onClick={() => !isOutOfStock && setSelectedInventory(item._id)}
                      disabled={isOutOfStock}
                      className={`p-0.5 rounded-lg border-2 transition-all text-sm font-semibold relative ${
                        selectedInventory === item._id 
                          ? 'border-[#FF6C0C] bg-orange-50 text-[#FF6C0C]' 
                          : isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          : 'border-gray-200 hover:border-[#FF6C0C] hover:bg-orange-50 text-gray-700'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold uppercase">
                          {displayValue}
                        </span>
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
          
          <div className="lg:mb-3 mb-1">
            <label className="block text-sm lg:font-bold font-semibold text-gray-700 lg:mb-2 mb-1">Quantity</label>
            <div className="flex items-center lg:gap-2 gap-1 bg-gray-50 lg:p-3 p-2 rounded-sm">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="lg:p-2 p-1 bg-white hover:bg-gray-100 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                disabled={quantity <= 1}
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
              <span className="lg:text-xl text-lg lg:font-bold sm:font-semibold text-gray-800  lg:w-16 w-12 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.mainInventory, quantity + 1))}
                className="lg:p-2 p-1 bg-white hover:bg-gray-100 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                disabled={quantity >= product.mainInventory}
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">Available</p>
                <p className="text-sm font-bold text-green-600">{product.mainInventory} units</p>
              </div>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl lg:p-4 p-2 lg:mb-4 mb-2 border border-gray-200">
            <h4 className="lg:font-bold font-semibold text-gray-700 lg:mb-3 mb-1.5 text-sm uppercase tracking-wide">Order Summary</h4>
            <div className="lg:space-y-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({quantity} items)</span>
                <span className="lg:font-bold font-semibold text-gray-900">৳{totalPrice}</span>
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
            className="w-full bg-linear-to-r from-green-500 to-green-600 text-white lg:py-2 py-2
             rounded-sm hover:from-[#FF6C0C] hover:to-[#db5c07] transition-all duration-300 
             lg:font-bold font-semibold lg:text-lg tex-md flex items-center justify-center lg:gap-2 gap-1 shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Adding to Cart...
              </>
            ) : (
              <>
                <Check size={24} strokeWidth={2.5} />
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

// Main Product List Client Component
const ProductListClient: React.FC<ProductListClientProps> = ({ 
  products, 
  title = "New Arrivals",
  subtitle,
  userRef,
  onAddToCart 
}) => {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleQuickAdd = (product: TProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleViewDetails = (product: TProduct) => {
    // Navigate to product details page or open quick view
    window.location.href = `/product/${product.slug}`;
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
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const displayProducts = showMore ? products : products.slice(0, 12);
  
  return (
    <div className="lg:py-0 py-0">
      <div className="text-start">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 font-bold mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="grid lg:grid-cols-6 md:grid-cols-4 grid-cols-2 gap-2 md:gap-5 mt-3 lg:mt-4">
        {displayProducts.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onQuickAdd={handleQuickAdd}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      {products.length > 12 && (
        <div className="text-center mt-10">
          <button 
            onClick={() => setShowMore(!showMore)}
            className="px-10 py-4 bg-linear-to-r from-[#FF6C0C] to-[#E55A00] text-white rounded-xl hover:from-[#E55A00] hover:to-[#CC4F00] transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {showMore ? (
              <>Show Less</>
            ) : (
              <>Show More ({products.length - 12} more products)</>
            )}
          </button>
        </div>
      )}
      
      <AddToCartModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCart}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductListClient;