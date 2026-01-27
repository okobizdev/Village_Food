import { getAllCategorys } from "@/services/categorys";
import CategoryCardSlider from "@/slider/CategoryCardSlider/CategoryCardSlider";
import React from "react";

const Category = async () => {
  const { data: categoriesList } = await getAllCategorys();
  return (
    <div className="Container lg:py-4  py-1 lg:mt-4 mt-2">
      <CategoryCardSlider categoriesList={categoriesList} />
    </div>
  );
};

export default Category;
