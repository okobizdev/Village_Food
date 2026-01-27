"use client";
import cashOnDelivery from "@/assets/payment/cash-on-delivery.png";
// import sslPay from "@/assets/payment/ssl-pay.png";
import bikashNagad from "@/assets/payment/bikash-nagad.jpg";
import { addOrder } from "@/services/order";
import { TProduct } from "@/types";
import { cities } from "@/utilits/cities";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import orderGift from "@/assets/gift/animation.gif";
import { useRef, useState } from "react";

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  customerCity: string;
  customerAddress: string;
  customerHouse: string;
  customerRoad: string;
  customerThana: string;
  customerAltPhone: number;
  note: string;
  paymentMethod: string;
  coupon?: string;
  terms?: boolean;
  mobileBankingProvider?: string;
  mobileNumber?: string;
  transactionId?: string;
}

interface Props {
  userRef: string;
  products: TProduct;
  shipping: number;
  setShipping: React.Dispatch<React.SetStateAction<number>>;
  setCoupon: React.Dispatch<React.SetStateAction<string | null>>;
  type: React.Dispatch<React.SetStateAction<string | null>>;
}

const CheckOutForm: React.FC<Props> = ({
  userRef,
  products,
  shipping,
  setShipping,
  setCoupon,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startCar, setStartCar] = useState(false);
  const [finalY, setFinalY] = useState(10);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { register, handleSubmit, control, watch, formState: { errors }, getValues, } = useForm<FormData>();
  const router = useRouter();
  const [showMobileBanking, setShowMobileBanking] = useState(false);
  const selectedPayment = watch("paymentMethod");
  const selectedMobileBank = watch("mobileBankingProvider");

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCity = e.target.value.toLowerCase();
    const hasFreeShipping: boolean =
      products.data.cartDetails?.some(
        (item: { product?: { freeShipping?: boolean } }) =>
          item.product?.freeShipping
      ) || false;

    setShipping(hasFreeShipping ? 0 : selectedCity === "dhaka" ? 60 : 120);
  };

  // ----------------- Calculation -----------------
  const Subtotal = products?.data?.subTotalPrice || 0;
  const discountValue = Number(products?.data?.couponDiscount) || 0;
  const payableAmount = Subtotal + (shipping || 0) - discountValue;
  console.log("payableAmount", payableAmount)
  // ----------------- Submit Handler -----------------
  const onSubmit = async (data: FormData) => {
    // No need to check for product discounts, coupon always applies on MRP
    await confirmOrder(data);
  };

  // ----------------- Apply Coupon -----------------
  // const handleAddCoupon = () => {
  //   const coupon = getValues("coupon");

  // if(products.discount !== null){
  //     if (coupon && coupon.trim() !== "") {
  //     setCoupon(coupon.trim());
  //     toast.success("Coupon applied on MRP Price", {
  //       theme: "colored",
  //       autoClose: 5000,
  //     });
  //   } else {
  //     setCoupon(null);
  //     toast.info("No coupon applied.", { theme: "colored", autoClose: 5000 });
  //   }
  // }else{
  //  if (coupon && coupon.trim() !== "") {
  //     setCoupon(coupon.trim());
  //     toast.success("Coupon applied ", {
  //       theme: "colored",
  //       autoClose: 5000,
  //     });
  //   } else {
  //     setCoupon(null);
  //     toast.info("No coupon applied.", { theme: "colored", autoClose: 5000 });
  //   }
  // }

  // }
  const handleAddCoupon = () => {
    const coupon = getValues("coupon")?.trim();

    // Check: does ANY product have discount?
    const hasProductDiscount = Number(products.data.productDiscount > 0);

    console.log(hasProductDiscount)

    if (coupon) {
      setCoupon(coupon);

      toast.success(
        hasProductDiscount
          ? "Coupon applied on Product  MRP Price"
          : "Coupon applied",
        {
          theme: "colored",
          autoClose: 5000,
        }
      );
    } else {
      setCoupon(null);
      toast.info("No coupon applied.", {
        theme: "colored",
        autoClose: 5000,
      });
    }
  };

  // ----------------- Confirm Order -----------------
  const confirmOrder = async (data: FormData) => {
    try {
      const order = {
        productRef: products?.data?.productRef,
        quantity: products?.data?.quantity || 1,
        userRef,
        subTotalPrice: Subtotal,
        totalPrice: payableAmount,
        couponDiscount: discountValue,
        shippingCost: shipping || 0,
        ...data,
      };
      console.log(order.totalPrice);

      setIsSubmitting(true);
      const result = (await addOrder(order)) as {
        status: string;
        message?: string;
        url?: string;
      };

      if (result?.url) {
        window.location.href = result.url;
        return;
      }

      if (result.status === "error") {
        toast.error(result.message || "Failed to confirm order.");
        setIsSubmitting(false);
        return;
      }

      setStartCar(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const buttonBox = buttonRef.current?.getBoundingClientRect();
      if (buttonBox) setFinalY(buttonBox.x + 150);

      setTimeout(() => {
        router.push("/thank-you");
        toast.success("Checkout completed successfully!");
        setIsSubmitting(false);
        setStartCar(false);
      }, 1500);
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Failed to confirm order.");
      setIsSubmitting(false);
    }
  };


  return (
    <div className="lg:mt-8 mt-4">
      <h1 className="text-center font-extrabold text-2xl lg:text-3xl mb-6">Checkout Info</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
  
        {/*Shipping Info */}
        <div className="lg:flex justify-center items-center lg:space-x-2 space-x-0">

          <div className="w-full">
            <h2 className="font-semibold text-gray-700">আপনার নাম</h2>
            <input
              type="text"
              placeholder="আপনার নাম লিখুন *"
              className="w-full my-2.5 border border-black/20 p-1.5 rounded
             focus:border-black focus:outline-none"
              {...register("customerName", { required: "Name is required" })}
            />
            {errors.customerName && (
              <span className="text-red-500">
                {String(errors.customerName.message)}
              </span>
            )}
          </div>
          <div className="w-full">
            <h2 className="font-semibold text-gray-700 ">আপনার মোবাইল </h2>
            <input
              type="text"
              placeholder="আপনার মোবাইল নাম্বার লিখুন*"
              className="w-full my-2.5 border border-black/20 p-1.5 rounded focus:border-black focus:outline-none"
              {...register("customerPhone", {
                required: "Number is required",
              })}
            />
            {errors.customerPhone && (
              <span className="text-red-500">
                {String(errors.customerPhone.message)}
              </span>
            )}
          </div>
        </div>

        {/*Shipping Info */}
        <div className="flex md:flex-row flex-col items-center md:gap-3 gap-1 ">
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 ">আপনার ঠিকানা</h2>
          <input
            type="text"
            placeholder="আপনার বিস্তারিত ঠিকানা লিখুন *"
            className="w-full my-2.5 border border-black/20 p-1.5 rounded focus:border-black focus:outline-none"
            {...register("customerAddress", {
              required: "Address is required",
            })}
          />
          {errors.customerAddress && (
            <span className="text-red-500">
              {String(errors.customerAddress.message)}
            </span>
          )}
        </div>


        <div className="flex md:flex-row flex-col items-center md:gap-3 gap-1  ">
          <div className="w-full ">
            <h2 className="font-semibold text-gray-700 ">আপনার থানা </h2>
            <input
              {...register("customerThana", {
                required: "Thana is required"
              })}
              className="w-full  border border-black/20 p-1.5 
            rounded focus:border-black focus:outline-none "
              type="text"
              placeholder="আপনার থানা লিখুন*"
            />
            {errors.customerThana && (
              <span className="text-red-500">
                {String(errors.customerThana.message)}
              </span>
            )}
          </div>
          <div className="w-full">
            <h2 className="font-semibold text-gray-700 "> জেলা সিলেক্ট করুন</h2>
            <select
              className="w-full my-2.5 border border-black/20 p-1.5 rounded focus:border-black focus:outline-none"
              {...register("customerCity", {
                required: "city is required",
                onChange: handleCityChange,
              })}
            >
              <option value="">Select City*</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {errors.customerCity && (
              <span className="text-red-500">
                {String(errors.customerCity.message)}
              </span>
            )}
          </div>
        </div>

        {/*BreakDown */}
        <div className="text-center rounded lg:py-8 py-4 lg:my-8 my-4 bg-gray-100">
          <p className="">Your total payable amount is</p>
          <h4 className="font-extrabold text-2xl text-[#FF6C0C] pt-2">
            ৳{payableAmount}
          </h4>
          <p className="font-bold text-xl pb-2">BreakDown</p>
          <div className="border border-gray-300 rounded-md mx-5 p-4">
            <div className="flex justify-between border-b border-gray-300 pb-2 font-bold text-[16px]">
              <p>Purpose</p>
              <h4>Amount</h4>
            </div>
            <div className="flex justify-between border-b border-gray-300 py-2">
              <p>Subtotal</p>
              <h4>৳{Subtotal}</h4>
            </div>
            <div className="flex justify-between border-b border-gray-300 py-2">
              <p>Shipping</p>
              <h4>৳{shipping}</h4>
            </div>
            <div className="flex justify-between border-gray-300 py-2">
              <p>Discount</p>
              <h4>৳{discountValue}</h4>
            </div>
          </div>
          <div className="pt-2">
            <p>You will get the delivery within 2-3 days after confirmation.</p>
          </div>
        </div>

        {/*payment Option */}
        <div>
          <h1 className="font-bold py-3">Payment Options</h1>
          <Controller
            name="paymentMethod"
            control={control}
            rules={{ required: "Please select a payment method" }}
            render={({ field }) => (
              <>
                <div className="flex gap-4">
                  <label
                    className={`flex items-center gap-2 cursor-pointer border  p-2 rounded-md hover:border-blue-400 duration-300 hover:shadow-blue-200 hover:scale-99  ${field.value === "cod"
                      ? "border-blue-500"
                      : "border-gray-300"
                      }`}
                  >
                    <input
                      type="radio"
                      {...field}
                      value="CashOnDelivery"
                      checked={field.value === "CashOnDelivery"}
                    />
                    <Image
                      className="h-8 w-full"
                      height={100}
                      width={100}
                      src={cashOnDelivery}
                      alt="COD"
                    />
                  </label>
                  {/* Mobile Banking (bKash/Nagad) */}
                  <label
                    className={`flex items-center gap-2 cursor-pointer border p-2 rounded-md hover:border-blue-400 duration-500 hover:shadow-blue-200 hover:scale-99 ${field.value === "MobileBanking"
                      ? "border-blue-500"
                      : "border-gray-300"
                      }`}
                  >
                    <input
                      type="radio"
                      {...field}
                      value="MobileBanking"
                      checked={field.value === "MobileBanking"}
                      onChange={(e) => {
                        field.onChange(e);
                        setShowMobileBanking(true);
                      }}
                    />
                    <Image
                      className="h-8 w-20"
                      height={150}
                      width={150}
                      src={bikashNagad}
                      alt="bKash Nagad"
                    />
                  </label>
                </div>
              </>
            )}
          />

          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">
              {String(errors.paymentMethod?.message)}
            </p>
          )}

          {/* Mobile Banking Dropdown Section */}
          {showMobileBanking && selectedPayment === "MobileBanking" && (
            <div className="mt-4 p-4 border border-blue-200 rounded-md bg-gray-100 animate-fadeIn">
              {/* Select Provider */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Mobile Banking Provider
                </label>
                <select
                  {...register("mobileBankingProvider", {
                    required: showMobileBanking ? "Please select a provider" : false,
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Provider</option>
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                </select>
                {errors.mobileBankingProvider && (
                  <p className="text-red-500 text-sm mt-1">
                    {String(errors.mobileBankingProvider?.message)}
                  </p>
                )}
              </div>

              {/* Show fields when provider is selected */}
              {selectedMobileBank && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      {...register("mobileNumber", {
                        required: selectedMobileBank
                          ? "Mobile number is required"
                          : false,
                        pattern: {
                          value: /^01[3-9]\d{8}$/,
                          message: "Please enter a valid Bangladesh mobile number",
                        },
                      })}
                      placeholder="01XXXXXXXXX"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.mobileNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.mobileNumber?.message)}
                      </p>
                    )}
                  </div>
                  {/* Transaction ID */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      {...register("transactionId", {
                        required: selectedMobileBank
                          ? "Transaction ID is required"
                          : false,
                        minLength: {
                          value: 8,
                          message: "Transaction ID must be at least 8 characters",
                        },
                      })}
                      placeholder="Enter transaction ID"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                    {errors.transactionId && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(errors.transactionId?.message)}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-md border border-orange-200">
                    <p className="font-medium">Instructions:</p>
                    <p>
                      1. Send payment to: <strong>01XXXXXXXXX</strong>
                    </p>
                    <p>2. Enter your mobile number used for payment</p>
                    <p>3. Enter the transaction ID you received</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/*Coupon Code */}
          <h2 className="font-bold pt-5">Got any Coupon Code?</h2>
          <div className="flex lg:flex-row flex-col pb-5  gap-4 w-full mt-2">
            <div className="xl:w-[40%] lg:w-[60%]">
              <input
                type="text"
                placeholder="Enter Coupon Code Here"
                className="border border-black/20 p-1.5 rounded focus:border-black focus:outline-none w-full"
                {...register("coupon")}
              />
            </div>
            <div
              onClick={() => handleAddCoupon()}
              className="bg-[#FF6C0C] py-2 px-10 text-white 2xl:w-[30%] xl:w-[40%] lg:w-[50%] rounded cursor-pointer text-center w-full"
            >
              Add Coupon
            </div>
          </div>

          {/* agree trams and condition */}
          <div className="flex gap-2">
            <input
              type="checkbox"
              {...register("terms", { required: "select terms & conditions" })}
            />

            <label>
              I agree to
              <Link
                href="/terms-condition"
                className="text-[#FF6C0C] hover:underline hover:text-amber-800"
              >
                Terms & Conditions,
              </Link>
              <Link
                href="/returnPolicy"
                className="text-[#FF6C0C] hover:underline hover:text-amber-800"
              >
                Refund Policy
              </Link>
              and
              <Link
                href="/privacyPolicy"
                className="text-[#FF6C0C] hover:underline hover:text-amber-800"
              >
                Privacy Policy
              </Link>
              of Silk Thrad.
            </label>
          </div>
          {errors.terms && (
            <span className="text-red-500">{String(errors.terms.message)}</span>
          )}

          <button
            ref={buttonRef}
            type="submit"
            disabled={isSubmitting}
            className={` text-sm font-semibold text-white py-2 w-full mt-8 rounded 
            cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden 
            ${isSubmitting ? " cursor-not-allowed" : ""}
            ${startCar === true
                ? "bg-[#ffffff] border border-[#e18243] "
                : "bg-[#FF6C0C]"
              }
            `}
          >
            {isSubmitting ? (
              <>
                {/* <span>Processing...</span> */}

                {startCar ? (
                  <AnimatePresence>
                    <div className="py-2.5">
                      <motion.div
                        initial={{ x: 30 }}
                        animate={{ x: finalY, scale: 1.1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 2,
                          ease: [0.4, 0, 0.2, 1], // slow start, fast end
                        }}
                        className="absolute left-2 bottom-1.5"
                      >
                        <Image
                          className="h-8 w-full"
                          height={100}
                          width={100}
                          src={orderGift}
                          alt="order-gift"
                        />
                      </motion.div>
                    </div>
                  </AnimatePresence>
                ) : (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  />
                )}
              </>
            ) : (
              "Confirm Order"
            )}
          </button>
          </div>
      </form>
    </div>
  );
};

export default CheckOutForm;

