import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Village Food | Terms & Conditions",
  description: "Village Food Terms and Conditions",
};

const TermCondition = async () => {
  return (
    <>
      <div className="max-w-7xl mx-auto py-10 px-6">
        <div className="flex flex-col gap-2 lg:gap-4">
          <div className="text-2xl lg:text-4xl font-semibold text-[#262626] text-center mt-14 lg:mt-0">Terms and Conditions</div>

          <p className="policy-page-text mt-4">Effective date: 9 February 2026</p>

          <p className="policy-page-text">Welcome to Village Food. These Terms and Conditions govern your use of our website and services. By using our services you agree to these Terms.</p>

          <h2 className="text-xl font-semibold mt-4">Definitions</h2>
          <ul className="policy-page-text list-disc ml-6">
            <li>"We", "Us", "Our": Village Food and its affiliates.</li>
            <li>"You", "Customer": any user accessing or using our site or services.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-4">Accounts and Eligibility</h2>
          <p className="policy-page-text">You must be at least 18 years old and provide accurate information to create an account. You are responsible for maintaining the confidentiality of your account credentials.</p>

          <h2 className="text-xl font-semibold mt-4">Orders, Prices, and Payments</h2>
          <p className="policy-page-text">All orders are subject to acceptance and availability. Prices shown include any applicable taxes where indicated. We accept the payment methods listed at checkout.</p>

          <h2 className="text-xl font-semibold mt-4">Product Information and Availability</h2>
          <p className="policy-page-text">We aim to display product information and stock accurately but do not guarantee complete accuracy. We may change products, descriptions, and pricing without prior notice.</p>

          <h2 className="text-xl font-semibold mt-4">Delivery and Risk</h2>
          <p className="policy-page-text">Delivery times are estimates. Risk of loss passes to you on delivery to the carrier or at the agreed delivery point.</p>

          <h2 className="text-xl font-semibold mt-4">Returns, Refunds, and Cancellations</h2>
          <p className="policy-page-text">Our Return & Refund Policy governs returns, cancellations and refunds. See the separate document for details.</p>

          <h2 className="text-xl font-semibold mt-4">User Conduct</h2>
          <p className="policy-page-text">You must not use our services for illegal purposes, infringe intellectual property rights, or attempt to harm the service or other users.</p>

          <h2 className="text-xl font-semibold mt-4">Intellectual Property</h2>
          <p className="policy-page-text">All site content, trademarks, and materials are owned by or licensed to us. You may not reproduce or use our content without permission.</p>

          <h2 className="text-xl font-semibold mt-4">Limitation of Liability</h2>
          <p className="policy-page-text">To the maximum extent permitted by law, we are not liable for indirect, incidental, consequential, or punitive damages arising from your use of the service.</p>

          <h2 className="text-xl font-semibold mt-4">Indemnification</h2>
          <p className="policy-page-text">You agree to indemnify and hold us harmless against claims arising from your breach of these Terms or your use of the service.</p>

          <h2 className="text-xl font-semibold mt-4">Termination</h2>
          <p className="policy-page-text">We may suspend or terminate accounts for violations of these Terms or for other lawful reasons.</p>

          <h2 className="text-xl font-semibold mt-4">Governing Law</h2>
          <p className="policy-page-text">These Terms are governed by the laws of the jurisdiction where our principal place of business is located, unless otherwise required by applicable law.</p>

          <h2 className="text-xl font-semibold mt-4">Changes to Terms</h2>
          <p className="policy-page-text">We may update these Terms from time to time. We will publish the updated Terms with a new Effective Date.</p>

          <h2 className="text-xl font-semibold mt-4">Contact</h2>
          <p className="policy-page-text">For questions about these Terms, contact us at the address shown on our site.</p>
        </div>
      </div>
    </>
  );
};

export default TermCondition;
