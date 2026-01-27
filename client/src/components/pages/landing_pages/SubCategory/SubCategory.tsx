import React from "react";

import { getAllProductsForShop } from "@/services/products";

import { addToCart } from "@/services/cart";
import ProductListClient from "../product/ProductListClient";
import { getUser } from "@/services/auth";

const SubCategory = async () => {
  const user = await getUser();
  const { data } = await getAllProductsForShop();
 
  return (
    <div className=" lg:w-10/12 w-11/12 lg:px-16 px-0 mx-auto ">
      <ProductListClient 
        products={data.result} 
        title="New Arrivals"
        subtitle="Exclusive Collection Just for You"
        userRef={user?.id }
        onAddToCart={addToCart}
      />
    </div>
  );
};

export default SubCategory;