import MainCheckOut from "@/components/pages/checkoutPage/MainCheckOut/MainCheckOut";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Village Food | Checkout",
  description: "Best E-commerce platform in BD",
};

export const revalidate = 0;
const Checkout = async () => {

  return (
    <div className="mt-14">
      <MainCheckOut />
    </div>
  );
};
export default Checkout;
