"use client";

import React from "react";
import { formatDate } from "date-fns";
import logo from "@/assets/logo/logo_sidebar.png";
import Barcode from "react-barcode";
import { TOrder } from "@/types/shared";
import { upperCase, upperFirst } from "lodash";
import { BRAND_NAME } from "@/config/config";
import { makeBDPrice } from "@/utils/helpers";
import Image from "next/image";

interface PrintInvoiceProps {
  orderData: TOrder;
}

const PrintInvoice = React.forwardRef<HTMLDivElement, PrintInvoiceProps>(
  ({ orderData }, ref) => {

    // TOTAL QUANTITY
    const totalQuantity = orderData.products?.reduce(
      (acc, item) => acc + Number(item?.quantity || 0),
      0
    );
    // DISCOUNT (from backend field)
    // const totalDiscount = Number(orderData.discount || 0);

    // SAFE SHIPPING COST CALCULATION
    const totalDiscount =
      Number(orderData.subTotalPrice || 0) +
      Number(orderData.shippingCost || 0) -
      Number(orderData.totalPrice || 0);
// console.log(calculatedShipping)
    return (
      <div
        ref={ref}
        className="print-area w-[60mm] mx-auto px-2 py-4 text-[11px] font-medium"
      >
        <div className="w-full flex flex-col justify-center items-center text-center py-2">
         <Image
            src={logo} alt={""}   
            className="h-[0.8cm] object-cover"        
           />
          <p className="mt-2">{BRAND_NAME}</p>
          <p className="text-[10px]">
            Address: Miprur 2, Oposite of Stadium Gate no. 1. Dhaka.
          </p>
          <div className="flex items-center justify-start text-[10px]">
            <span>Hotline:</span>{" "}
            <span className="">Phone: +880 01623-726069</span>
          </div>
          <p className="text-[10px]">Email :silkthread.bd@gmail.com</p>
          <p className="text-[10px]">Website : www.silkthread.bd.com</p>
        </div>

        <div className="w-full border-b border-[#000000] py-2">
          <div className="flex justify-between items-center">
            <p>Order ID :</p>
            <h1 className="font-bold">{orderData.orderId}</h1>
          </div>

          <div className="flex justify-between items-center">
            <p>Date:</p>
            <p className="font-bold">
              {formatDate(String(orderData.createdAt), "dd/MM/yyyy")}
            </p>
          </div>
        </div>

        <div className="w-full py-2 border-b border-[#000000]">
          <div className="flex justify-between items-center">
            <p>Customer:</p>
            <h1 className="font-bold">
              {upperFirst(orderData.customerName)}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <p>Phone:</p>
            <h1 className="font-bold">{orderData.customerPhone}</h1>
          </div>
        </div>

        <div className="w-full">
          {orderData?.products?.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-end py-2 border-b border-[#000000]"
            >
              <div className="flex w-5/6">
                <p>#{index + 1}.</p>
                <p>{`${item?.productRef?.name} - ${
                  item?.inventoryRef?.name
                    ? upperCase(item?.inventoryRef?.name)
                    : "N/A"
                } - ${
                  item?.inventoryRef?.level
                    ? upperCase(item?.inventoryRef?.level)
                    : "N/A"
                }, Unit: ${item?.quantity} x ${makeBDPrice(item?.price)}`}</p>
              </div>

              <h1 className="font-bold w-1/6">
                {makeBDPrice(
                  Number(item?.price || 0) * Number(item?.quantity || 0)
                )}
              </h1>
            </div>
          ))}
        </div>

        <div className="">
          <div className="py-2 border-b border-[#000000] border-dashed">
            <div className="flex justify-between items-center">
              <p>Total Quantity:</p>
              <h1>{totalQuantity}</h1>
            </div>

            <div className="flex justify-between items-center">
              <p>Subtotal:</p>
              <h1>{makeBDPrice(orderData.subTotalPrice || 0)}</h1>
            </div>

            <div className="flex justify-between items-center">
              <p>Discount:</p>
              <h1>{makeBDPrice(totalDiscount)}</h1>
            </div>

            <div className="flex justify-between items-center">
              <p>Delivery Charge:</p>
              <h1>{makeBDPrice(orderData.shippingCost || 0)}</h1>
            </div>

            <div className="flex justify-between items-center">
              <p className="font-bold">Grand Total:</p>
              <h1 className="font-bold">
                {makeBDPrice(orderData.totalPrice || 0)}
              </h1>
            </div>
          </div>
        </div>

        <div className="py-2 border-b border-[#000000] text-center">
          <p>
            Items may be exchanged subject to {BRAND_NAME} sales policies within
            7 days. No cash refund is applicable.
          </p>
        </div>

        <div className="flex flex-col justify-center items-center py-2">
          <p className="text-center">THANK YOU FOR SHOPPING !</p>
          <Barcode
            value={orderData.orderId}
            width={1.4}
            height={25}
            fontSize={10}
          />
        </div>
      </div>
    );
  }
);

PrintInvoice.displayName = "PrintInvoice";
export default PrintInvoice;
