"use client";

import { useState } from "react";
import { Flame, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { AddToCartModal } from "../AddToCartModal/AddToCartModal";
import { ProductCard } from "../ProductCard/ProductCard";
// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { TProduct } from "@/types/product";

const sectionConfig = {
    bestDeal: { icon: Flame, color: "text-orange-500" },
    bestSeller: { icon: Star, color: "text-yellow-500" },
    popular: { icon: TrendingUp, color: "text-green-500" },
} as const;

interface Props {
    products: TProduct[];
    title: string;
    type: "bestDeal" | "bestSeller" | "popular";
    userRef?: string;
    onAddToCart: (data: any) => Promise<any>;
}

const HomeProductSection = ({
    products,
    title,
    type,
    userRef,
    onAddToCart,
}: Props) => {
    const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { icon: Icon, color } = sectionConfig[type];

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

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b-2 border-primary pb-4">
                <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${color}`} />
                    <h2 className="text-3xl font-black text-primary">{title}</h2>
                </div>

                <Link href="/shop" className="hidden md:block text-sm font-bold bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition">
                    View All
                </Link>
            </div>
            {/* Swiper */}
            <Swiper
                modules={[Autoplay]}
                spaceBetween={8}
                slidesPerView={2}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                loop={products.length > 5}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product._id}>
                        <ProductCard
                            product={product}
                            onQuickAdd={handleQuickAdd}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Modal */}
            <AddToCartModal
                product={selectedProduct}
                isOpen={isOpen}
                isLoading={loading}
                onClose={() => setIsOpen(false)}
                onConfirm={handleConfirm}
            />
        </div >
    );
};

export default HomeProductSection;
