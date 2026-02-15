"use client"

import { TProduct } from "@/types/product";
import { Check, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useState } from "react";

// Modal Component
export const AddToCartModal: React.FC<{
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

    const modalImage = product.thumbnailImage;


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl animate-scale-in overflow-hidden max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-primary p-4 flex items-center justify-between sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingCart size={24} />
                        Add to Cart
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                        <div className="w-24 h-24 shrink-0 bg-white rounded-lg overflow-hidden shadow-md">
                            <img
                                src={modalImage}
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
                                Size
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {product.inventoryRef.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedInventory(item._id)}
                                        className={`p-2 rounded-lg border-2 text-xs font-semibold cursor-pointer ${selectedInventory === item.level
                                            ? "border-[#FF6C0C] bg-orange-50 text-[#FF6C0C]"
                                            : "border-gray-200 hover:border-[#FF6C0C]"
                                            }`}
                                    >
                                        {item.level}
                                    </button>
                                ))}

                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200 cursor-pointer"
                                disabled={quantity <= 1}
                            >
                                <Minus size={18} strokeWidth={2.5} />
                            </button>
                            <span className="text-2xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(quantity + 1))}
                                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm border border-gray-200 cursor-pointer"
                                disabled={quantity >= product.mainInventory}
                            >
                                <Plus size={18} strokeWidth={2.5} />
                            </button>
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
                        className="w-full bg-linear-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 cursor-pointer"
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
                            Please select a size
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
