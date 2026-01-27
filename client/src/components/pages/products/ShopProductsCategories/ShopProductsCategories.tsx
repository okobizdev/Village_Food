"use client";

import { TChildCategory, TShopSideBar, TSubCategory } from "@/types";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopProductsCategoriesProps {
  shopSideBar: TShopSideBar[];
}

const ShopProductsCategories: React.FC<ShopProductsCategoriesProps> = ({ shopSideBar }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  // const [selectedChildCategories, setSelectedChildCategories] = useState<string[]>([]);

  useEffect(() => {
    const cats = searchParams.get("category")?.split(",") || [];
    // const subCats = searchParams.get("subCategory")?.split(",") || [];
    // const childCats = searchParams.get("childCategory")?.split(",") || [];
    setSelectedCategories(cats);
    // setSelectedSubCategories(subCats);
    // setSelectedChildCategories(childCats);
  }, [searchParams]);

  const updateParams = (type: "category" | "subCategory" | "childCategory", value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentValues = new Set((searchParams.get(type)?.split(",") || []).filter(Boolean));

    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);

    }

    if (currentValues.size > 0) {
      newParams.set(type, Array.from(currentValues).join(","));
    } else {
      newParams.delete(type);
    }

    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="px-4 pt-2 sticky top-0 h-screen overflow-y-scroll custom-scroll">
      <div className="space-y-3">
        {shopSideBar?.map((cat) => (
          <div key={cat.slug} className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Main Category Card */}
            <div className="p-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  onChange={() => updateParams("category", cat.slug)}
                  checked={selectedCategories.includes(cat.slug)}
                  className="w-4 h-4 rounded border-gray-300 text-[#495588] focus:ring-[#495588] focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-semibold text-gray-800 group-hover:text-[#495588] transition-colors">
                  {cat.name}
                </span>
              </label>
              
              {/* SubCategories */}
              {Array.isArray(cat.subCategories) && cat.subCategories.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {cat.subCategories.map((subCat: TSubCategory) => (
                    <div key={subCat.slug} className="pl-2 cursor-pointer">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          onChange={() => updateParams("subCategory", subCat.slug)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-[#495588] focus:ring-2 focus:ring-[#495588] focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-[#495588] transition-colors">
                          {subCat.name}
                        </span>
                      </label>
                      {/* Child Categories */}
                      {Array.isArray(subCat.childCategories) && subCat.childCategories.length > 0 && (
                        <div className="mt-2 ml-4 space-y-1.5 pl-3 border-l-2 border-gray-200">
                          {subCat.childCategories.map((childCat: TChildCategory) => (
                            <label key={childCat.slug} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                onChange={() => updateParams("childCategory", childCat.slug)}
                                className="w-3 h-3 rounded border-gray-300 text-[#495588] focus:ring-2 focus:ring-[#495588] focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-xs text-gray-600 group-hover:text-[#495588] transition-colors">
                                {childCat.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopProductsCategories;
