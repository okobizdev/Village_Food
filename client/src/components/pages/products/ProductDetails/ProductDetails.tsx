"use client";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import ProductDetailsSlide from "@/slider/ProductDetailsSlide/ProductDetailsSlide";
import { addToCart } from "@/services/cart";
import { toast } from "react-toastify";
import { getUser } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useAnimation } from "framer-motion";
import { TProduct } from "@/types/product";
interface Props {
  product: TProduct;
}

const ProductDetails: React.FC<Props> = ({ product }) => {
  const [count, setCount] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);


  const [levelError, setLevelError] = useState(false);
  const router = useRouter();
  const controls = useAnimation();

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const {
    name,
    thumbnailImage,
    backViewImage,
    description,
    optionalImages,
    mrpPrice,
    price,
    inventoryRef,
    inventoryType,
    _id,
  } = product;


  const handleAddToCart = async () => {
    const user = await getUser();
    if (!user) {
      toast.error("Please login to add product to cart.");
      router.push("/login");
      return;
    }
    if (
      (inventoryType === "levelInventory" ||
        inventoryType === "colorLevelInventory") &&
      !selectedLevel
    ) {
      setLevelError(true);
      return;
    }

    if (
      (inventoryType === "colorLevelInventory" ||
        inventoryType === "colorInventory") &&
      !selectedColor
    ) {
      return;
    }
    try {
      controls.set({ x: 0, y: 0, scale: 1 });
      const product: {
        quantity: number;
        productRef: string;
        userRef: string | undefined;
        inventoryRef?: string | null;
      } = {
        quantity: count,
        productRef: _id,
        userRef: user?.id,
      };

      if (inventoryType == "inventory") {
        product.inventoryRef = inventoryRef[0]._id;
      } else if (inventoryType == "levelInventory") {
        product.inventoryRef = selectedLevel;
      } else if (inventoryType == "colorInventory") {
        product.inventoryRef = selectedColor;
      } else if (inventoryType == "colorLevelInventory") {
        product.inventoryRef = selectedColor;
      }

      await addToCart(product);
      // router.push("/cart");
      toast.success("Product added to cart!");
      setAddedToCart(true)
      setLevelError(false);
      controls.start({
        scale: 0.01,
        x: 1200,
        y: -200,
        transition: { duration: 0.6, ease: "easeInOut" },
      });

      setTimeout(() => {
        controls.set({ x: 10, scale: 0 });
      }, 1000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add product to cart.");
    }
  };


  return (
    <div className="max-w-7xl mx-auto  py-8  lg:mt-14 mt-16">
      <div className="grid lg:grid-cols-2 gap-8 ">
        <ProductDetailsSlide
          controls={controls}
          thumbnailImage={thumbnailImage}
          backViewImage={backViewImage}
          optionalImages={optionalImages}
          videoUrl={product.videoUrl}
          name={name}
        />

        <div className="">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-700">
            {name}
          </h2>

          <div className="flex gap-2 mt-2 text-gray-700">
            {Number(price) !== Number(mrpPrice) ? (
              <>
                <p className="line-through text-[#262626]/60 font-semibold flex items-center gap-1">
                  <span>৳</span> <span>{Number(mrpPrice).toFixed(2)}</span>
                </p>
                <p className="flex items-center gap-1 font-semibold text-xl lg:text-2xl text-gray-700">
                  <span>৳</span> <span>{Number(price).toFixed(2)}</span>
                </p>
              </>
            ) : (
              <p className="flex items-center gap-1 font-semibold text-xl lg:text-2xl text-gray-700">
                <span>৳</span> <span>{Number(price).toFixed(2)}</span>
              </p>
            )}
          </div>


          <div className="mt-3">
            {(inventoryType === "levelInventory" ||
              inventoryType === "colorLevelInventory") && (
                <div className="flex flex-col">
                  <h3 className="text-base md:text-lg font-semibold">
                    Select Size:
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#262626]/60 mt-1 cursor-pointer">
                    {inventoryRef
                      ?.filter(
                        (value, index, item) =>
                          index === item.findIndex((t) => t.level === value.level)
                      )
                      .map((size) => (
                        <p
                          key={size._id}
                          onClick={() => {
                            setLevel(size.level);
                            setSelectedLevel(size._id);
                            setSelectedColor(null);
                            setLevelError(false);
                          }}
                          className={` p-1 border border-primary hover:bg-white hover:text-primary duration-300 cursor-pointer rounded text-center flex items-center justify-center uppercase ${level === size.level ? "bg-primary text-white" : "border-primary"
                            }`}
                        >
                          {size.level}
                        </p>
                      ))}
                  </div>
                  {levelError && (
                    <p className="text-red-500 text-sm mt-1">
                      Please select a size.
                    </p>
                  )}
                </div>
              )}
          </div>

          <div className="border-b-2 pb-4 border-primary">
            <div className="mt-4 flex items-center gap-2 ">
              <div className="flex items-center justify-between border border-primary rounded px-3 py-[7px] md:w-[25%] w-[30%]">
                <p onClick={handleDecrement} className="cursor-pointer">
                  <FiMinus />
                </p>
                <span>{count}</span>
                <p onClick={handleIncrement} className="cursor-pointer">
                  <FiPlus />
                </p>
              </div>
              <div className="w-full cursor-pointer">
                {!addedToCart ? (
                  <button
                    onClick={handleAddToCart}
                    className="bg-primary flex items-center gap-1 px-6 py-2.5 font-semibold text-sm rounded text-white cursor-pointer "
                  >
                    <FiPlus />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <button
                    onClick={() => router.push("/checkout")}
                    className="bg-green-600 flex items-center gap-1 px-6 py-2.5 font-semibold text-sm rounded text-white hover:bg-green-700 transition cursor-pointer"
                  >
                    Go to Checkout
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
