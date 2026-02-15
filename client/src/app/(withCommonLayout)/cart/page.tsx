import Image from "next/image";
import Link from "next/link";
import CartDelete from "@/components/actionButton/CartDelete";
import { getCartProducts } from "@/services/cart";
import { getUser } from "@/services/auth";
import { Key, ReactNode } from "react";
import { Metadata } from "next";
import { TProduct } from "@/types/product";

export const metadata: Metadata = {
  title: "Village Food | cart",
  description: "Best E-commerce platform in BD",
};

const Cart = async () => {
  const user = await getUser();
  const userId = user?.id;
  const coupon = "";
  const products = await getCartProducts(userId, coupon);

  return (
    <>
      <div className="max-w-7xl mx-auto mt-20">
        <div className="mx-4 md:mx-6 lg:mx-8 2xl:mx-0 ">
          <div className="hidden lg:block">
            <h2 className="font-bold text-3xl text-center py-8">Your Cart</h2>

            {/* Header row */}
            <div className="grid grid-cols-7 font-bold border-t border-black/20 py-5">
              <div className="col-span-2">Product</div>
              <div>Unit Price</div>
              <div>Size</div>
              <div>Quantity</div>
              <div>Subtotal</div>
              <div>Action</div>
            </div>
            {/* make a div */}

            {/* Product rows */}
            {products?.data?.cartDetails?.map(
              (product: {
                inventory: any;
                quantity: string;
                subtotal: ReactNode;
                savedAmount: ReactNode;
                cartId: string;
                _id: Key | null | undefined;
                product: TProduct;
              }) => (
                <div
                  key={product._id}
                  className="grid grid-cols-7 items-center border-t border-black/20 py-3"
                >
                  {/* Product */}
                  <div className="col-span-2 flex flex-col xl:flex-row items-start xl:items-center gap-3">
                    {product?.product?.thumbnailImage && (
                      <Image
                        height={100}
                        width={100}
                        src={product?.product?.thumbnailImage}
                        alt={product?.product?.name}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                    <p className="md:text-base text-sm line-clamp-3">
                      {product?.product?.name}
                    </p>
                  </div>

                  {/* Unit Price */}
                  <div className="flex gap-2">
                    <p>৳ {product?.product?.price}</p>
                    {product?.product?.price !== product?.product?.mrpPrice && (
                      <p className="text-red-600 line-through">
                        ৳ {product?.product?.mrpPrice}
                      </p>
                    )}
                  </div>


                  {/* Size */}
                  <div>
                    <p>
                      <span className="uppercase">
                        {product?.inventory?.level || "N/A"}
                      </span>
                    </p>
                  </div>

                  {/* Quantity */}
                  <div>{product?.quantity || "N/A"}</div>

                  {/* Subtotal */}
                  <div>
                    <p>৳ {product?.subtotal}</p>
                    <p className="text-red-600 line-through">
                      ৳ {product?.savedAmount}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <CartDelete cardId={product?.cartId} />
                </div>
              )
            )}
          </div>

          <div className="lg:hidden block">
            <h2 className="font-bold text-3xl text-center py-8">Your Cart</h2>

            {/* Product rows */}
            {products?.data?.cartDetails?.map(
              (product: {
                quantity: string;
                _id: Key | null | undefined;
                subtotal: ReactNode;
                savedAmount: ReactNode;
                cartId: string;
                product: TProduct;
              }) => (
                <div
                  key={product?.product?._id}
                  className=" flex flex-col mb-5 bg-[#fcf9f9] hover:bg-[#E6E6E6] transition-colors duration-200  rounded  "
                >
                  {/* Product */}
                  <div className=" bg-[#F6F6F6] flex justify-between border-t border-black/5 py-3 px-3 rounded-t">
                    <div className="font-bold text-[15px]">
                      {/* <p>Product</p> */}
                      <p className="text-[#2287e0] hover:underline hover:text-[#014C8C] px-1">
                        {product?.product?.name}
                      </p>
                    </div>

                    {product?.product?.thumbnailImage && (
                      <Image
                        height={100}
                        width={100}
                        src={product?.product?.thumbnailImage}
                        alt={product?.product?.name}
                        className="w-20 h-20 object-cover"
                      />
                    )}
                  </div>
                  <div className="hover:bg-[#E6E6E6] rounded-b">
                    {/* Unit Price */}
                    <div className=" flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Price</p>
                      <div className="flex  gap-2">
                        {/* <p>৳{product.price}</p> */}
                        <p>৳ {product?.product?.price}</p>
                        <p className="text-red-600 line-through">
                          ৳ {product?.product?.mrpPrice}
                        </p>
                      </div>
                    </div>

                    {/* Size */}
                    <div className=" flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Size</p>
                      {product?.product?.inventory?.level || "N/A"}
                    </div>

                    {/* Quantity */}
                    <div className=" flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Quantity</p>
                      <p>{product?.quantity || "N/A"}</p>
                    </div>

                    {/* Subtotal */}
                    <div className=" flex justify-between border-t border-black/5 py-3 px-3">
                      <p className="font-bold text-[15px]">Subtotal</p>
                      <div className="flex  gap-2">
                        <p>৳ {product?.subtotal}</p>
                        <p className="text-red-600 line-through">
                          ৳ {product?.savedAmount}
                        </p>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className=" flex justify-between border-t border-black/5 py-3 px-3">
                      <span className=" font-bold text-[15px]">
                        Remove
                      </span>
                      <CartDelete cardId={product?.cartId} />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex flex-col gap-8 justify-between items-center my-12">
            <div className="text-2xl">
              Total Amount (৳):
              <span className="text-3xl font-bold text-green-600">
                {" "}
                {products?.data?.totalPrice}
              </span>
            </div>
            <Link
              href={products?.data?.cartDetails?.length ? "/checkout" : "/shop"}
              className="text-white rounded-md  items-center text-center w-[70%] sm:w-[50%] md:w-[40%]  bg-primary hover:bg-green-700 px-2 py-2"
            >
              <span>Place Order</span>
            </Link>
            <Link
              href="/shop"
              className="text-white  rounded-md items-center text-center  w-[70%] sm:w-[50%] md:w-[40%]  bg-primary hover:bg-green-700 px-2 py-2 mt-5"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
          <div className="bg-[#F6F6F6] text-gray-600 rounded text-center py-5 px-8 my-5">
            <span>
              * If you wish to make a bulk order, please call us at{" "}
              <span className="font-bold text-black"> +88 01714-028-279 </span>
              or email at{" "}
              <span className="font-bold text-black">yousufengineering2024@gmail.com</span> for more
              information.
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
