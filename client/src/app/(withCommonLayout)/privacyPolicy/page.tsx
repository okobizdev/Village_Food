// import NavBar from "@/components/pages/header/NavBar/NavBar";
// import { getUser } from "@/services/auth";
// import { getCartProducts } from "@/services/cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Silk Tread | Privacy policy",
  description: "Best E-commerce platform in BD",
};

const PrivacyPolicy = async () => {
  // const user = await getUser();
  // const userId = user?.id;
  // const coupon = "";
  // const products = await getCartProducts(userId, coupon);
  return (
    <>
      {/* <NavBar userCartProducts={products?.data} /> */}
     <div className="Container py-10 lg:w-10/12 mx-auto lg:px-20 px:6 w-full ">
      <div className="flex flex-col gap-2 lg:gap-4">
        <h1 className="text-2xl lg:text-4xl font-semibold text-[#262626] text-center mt-14 lg:mt-0">
          Return & Refund Policy
        </h1>

        <p className="policy-page-text">
          Silk Thread considers each of our customers to be a part of our
          family. Ensuring and encouraging the bond of trust with our
          customers, Silk Thread brings you the option to return products
          you received (if the product is damaged or mistakenly designed).
          In such cases, Silk Thread will provide you with fresh
          replacement products.
        </p>

        <p className="policy-page-text">
          If for any reason you are unsatisfied with your order, you may
          return it as long as the following criteria are met:
        </p>

        <ul className="policy-page-text list-disc ml-6">
          <li>
            You must request a return or replacement within 72 hours from
            the date you received the product.
          </li>
          <li>
            Items will <strong>NOT</strong> be exchanged or returned if the request is made
            after 72 hours.
          </li>
          <li>
            All returned items must be unused and in their original
            condition with all original tags and packaging intact.
          </li>
          <li>
            If the product came with a free promotional item, the free
            item must also be returned.
          </li>
          <li>
            Refund or replacement is subject to inspection by the Silk
            Thread team.
          </li>
          <li>
            Replacement depends on stock availability. If out of stock, a
            full refund will be issued.
          </li>
          <li>
            Cash on Delivery convenience charge and shipping fee are
            non-refundable.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">Information We Collect</h2>
        <ul className="policy-page-text list-disc ml-6">
          <li>Pages you visit/access</li>
          <li>Links you click</li>
          <li>Number of times you access a page</li>
          <li>ZIP/Postal code</li>
          <li>Number of times you have shopped on our website</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          Reasons for Returns & Replacement
        </h2>
        <ul className="policy-page-text list-disc ml-6">
          <li>Product is damaged, defective, or not as described</li>
          <li>Size mismatch</li>
          <li>Color mismatch</li>
          <li>Wrongly printed clothing</li>
          <li>Wrong product sent</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">How to Return</h2>
        <p className="policy-page-text">
          Contact Silk Thread Customer Care at{" "}
          <a href="mailto:silkthread.bd@gmail.com" className="text-blue-600">
            silkthread.bd@gmail.com
          </a>{" "}
          within 72 hours after receiving your order.
        </p>

        <p className="policy-page-text">
          After we receive your returned item, we will conduct a quality
          check. If the reason is valid, we will either replace the product
          or proceed with a refund.
        </p>

        <h2 className="text-xl font-semibold mt-4">Refund Policy</h2>

        <ul className="policy-page-text list-disc ml-6">
          <li>
            Refund will be processed after the returned product is
            evaluated.
          </li>
          <li>
            If the replacement item is out of stock, a full refund will be
            issued.
          </li>
          <li>
            Cash on Delivery convenience charge and shipping fee are
            non-refundable.
          </li>
          <li>
            For COD orders, no refund is required as no payment was made.
          </li>
          <li>
            For online payments (Card, Mobile Banking, Bank Transfer),
            refunds will be sent to the respective payment source.
          </li>
          <li>
            If online payment was duplicated due to a technical error, it
            will be refunded.
          </li>
          <li>
            Refund processing time is 7–10 working days. If not received
            within this time, please contact us at{" "}
            <a
              href="mailto:silkthread.bd@gmail.com"
              className="text-blue-600"
            >
              silkthread.bd@gmail.com
            </a>
            .
          </li>
        </ul>
      </div>
    </div>
    </>
  );
};

export default PrivacyPolicy;
