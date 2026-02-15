import { getAllCategorys } from "@/services/categorys";
import CategoryCardSlider from "@/slider/CategoryCardSlider/CategoryCardSlider";
import React from "react";

const Category = async () => {
  const { data: categoriesList } = await getAllCategorys();
  return (
    <div className="px-4 md:px-6 lg:px-8 2xl:px-0 mb-12">
      <CategoryCardSlider categoriesList={categoriesList} />
    </div>
  );
};

export default Category;
