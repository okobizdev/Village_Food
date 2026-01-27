// import NavBar from "@/components/pages/header/NavBar/NavBar";
// import { getUser } from "@/services/auth";
// import { getCartProducts } from "@/services/cart";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Silk Thread | Return Policy",
  description: "Best E-commerce platform in BD",
};

const ReturnPolicy = async() => {
  // const user = await getUser();
  // const userId = user?.id;
  // const coupon = "";
  // const products = await getCartProducts(userId, coupon);
  return (
    <>
    {/* <NavBar  userCartProducts ={ products?.data}/> */}
     <div className="policy-container text-gray-800 leading-relaxed  lg:px-20  px-6 lg:w-10/12 w-full  mx-auto mt-24 ">

  <p>
    <strong>Silk Thread</strong> considers each of our customers to be a part of our family. 
    To uphold this bond of trust, Silk Thread offers you the option to return products you received 
    <strong> if they are damaged or designed incorrectly.</strong> 
    In such cases, Silk Thread will provide a fresh replacement.
  </p>

  <p>
    If for any reason you are unsatisfied with your order, you may return it as long as your item meets the criteria listed below:
  </p>

  <h2 className="text-xl font-semibold">Return & Replacement Conditions</h2>
  <ul className="list-disc ml-6 space-y-2">
    <li>You must inform us <strong>within 72 hours</strong> of receiving the item.</li>
    <li>Items cannot be returned or exchanged after 72 hours.</li>
    <li>
      Returned items must be <strong>unused</strong>, in <strong>original condition</strong>, with all
      tags and packaging intact, and must not be broken or tampered with.
    </li>
    <li>If the product included a free promotional item, it must also be returned.</li>
    <li>All returned products will undergo inspection by the Silk Thread team.</li>
    <li>
      Replacement depends on <strong>stock availability</strong>. If unavailable, you will receive a 
      full refund.
    </li>
    <li>
      Cash on Delivery charges and shipping fees are <strong>non-refundable</strong>.
    </li>
  </ul>

  <h2 className="text-xl font-semibold">Information We May Collect</h2>
  <ul className="list-disc ml-6 space-y-2">
    <li>Pages you visit or access</li>
    <li>Links you click</li>
    <li>Number of visits per page</li>
    <li>ZIP/Postal code</li>
    <li>Number of purchases on our website</li>
  </ul>

  <h2 className="text-xl font-semibold">Valid Reasons for Return or Replacement</h2>
  <ul className="list-disc ml-6 space-y-2">
    <li>Product is damaged, defective, or not as described</li>
    <li>Size mismatch (for clothing)</li>
    <li>Color mismatch</li>
    <li>Incorrect or faulty print</li>
    <li>Wrong product delivered</li>
  </ul>

  <h2 className="text-xl font-semibold">How to Return an Item</h2>
  <ol className="list-decimal ml-6 space-y-3">
    <li>
      Contact Silk Thread Customer Care at 
      <a href="mailto:silkthread.bd@gmail.com" className="text-blue-600 underline ml-1">
        silkthread.bd@gmail.com
      </a> 
      within <strong>72 hours</strong> of receiving your order.
    </li>
    <li>
      After we receive and inspect your returned item, we will either replace it with a new one or issue a refund, 
      depending on eligibility.
    </li>
  </ol>

  <h2 className="text-xl font-semibold">Refund Policy</h2>
  <ul className="list-disc ml-6 space-y-2">
    <li>Refunds are processed only after evaluation of the returned product.</li>
    <li>If replacement stock is unavailable, you will receive a full refund.</li>
    <li>COD convenience charges and shipping fees are non-refundable.</li>
    <li>No refund is needed for COD orders since no advance payment was made.</li>
    <li>
      For Credit Card, Debit Card, Mobile Banking, or Bank Transfer payments, refunds will be sent to the 
      original payment method.
    </li>
    <li>If online payment was made twice due to a technical issue, the duplicate payment will be refunded.</li>
    <li>
      Refunds take <strong>7–10 working days</strong>. If not received within this timeframe, contact us at 
      <a href="mailto:silkthread.bd@gmail.com" className="text-blue-600 underline ml-1">
        silkthread.bd@gmail.com
      </a>.
    </li>
  </ul>

</div>

    </>
  );
};

export default ReturnPolicy;
