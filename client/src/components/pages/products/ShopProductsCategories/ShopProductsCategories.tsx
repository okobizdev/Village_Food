"use client";


import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TShopSideBar } from "@/types/shopSideBar";
import { TSubCategory } from "@/types/subCategory";
import { TChildCategory } from "@/types/childCategory";
import { DollarSign } from "lucide-react";

interface ShopProductsCategoriesProps {
  shopSideBar: TShopSideBar[];
}

const ShopProductsCategories: React.FC<ShopProductsCategoriesProps> = ({ shopSideBar }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const cats = searchParams.get("category")?.split(",") || [];
    const min = searchParams.get("minPrice") || "";
    const max = searchParams.get("maxPrice") || "";

    setMinPrice(min);
    setMaxPrice(max);
  }, [searchParams]);

  const updateParams = (
    type: "category" | "subCategory" | "childCategory",
    value: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    const alreadySelected = params.get(type) === value;

    // all category level clear
    params.delete("category");
    params.delete("subCategory");
    params.delete("childCategory");

    //  click → unselect
    if (!alreadySelected) {
      params.set(type, value);
    }

    // price filter keep 
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`);
  };


  // Apply price filter
  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`);
  };

  // Clear price filter
  const clearPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="px-4 pt-2 mt-6 sticky top-0 h-screen overflow-y-scroll custom-scroll">
      <div className="space-y-3">
        {shopSideBar?.map((cat) => (
          <div key={cat.slug} className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Main Category Card */}
            <div className="p-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  onChange={() => updateParams("category", cat?.slug)}
                  checked={searchParams.get("category") === cat.slug}
                  className="w-4 h-4 rounded border-gray-300 text-[#495588] focus:ring-[#495588] focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-semibold text-gray-800 group-hover:text-[#495588] transition-colors">
                  {cat?.name}
                </span>
              </label>

              {/* SubCategories */}
              {Array.isArray(cat?.subCategories) && cat?.subCategories?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                  {cat?.subCategories?.map((subCat: TSubCategory) => (
                    <div key={subCat.slug} className="pl-2 cursor-pointer">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          onChange={() => updateParams("subCategory", subCat?.slug)}
                          checked={searchParams.get("subCategory") === subCat.slug}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-[#495588] focus:ring-2 focus:ring-[#495588] focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-[#495588] transition-colors">
                          {subCat?.name}
                        </span>
                      </label>
                      {/* Child Categories */}
                      {Array.isArray(subCat?.childCategories) && subCat?.childCategories?.length > 0 && (
                        <div className="mt-2 ml-4 space-y-1.5 pl-3 border-l-2 border-gray-200">
                          {subCat?.childCategories?.map((childCat: TChildCategory) => (
                            <label key={childCat.slug} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                onChange={() => updateParams("childCategory", childCat?.slug)}
                                checked={searchParams.get("childCategory") === childCat.slug}
                                className="w-3 h-3 rounded border-gray-300 text-[#495588] focus:ring-2 focus:ring-[#495588] focus:ring-offset-0 cursor-pointer"
                              />
                              <span className="text-xs text-gray-600 group-hover:text-[#495588] transition-colors">
                                {childCat?.name}
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
      {/* Price Range Filter */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-md border-2 border-green-200 p-5 sticky bottom-0 shadow-md mt-3">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h4 className="font-black text-gray-900">Price Range</h4>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Min (৳)</label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Number(value) < 0) return;
                  setMinPrice(value);
                }}
                className="w-full border-2 border-green-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Max (৳)</label>
              <input
                type="number"
                placeholder="10000"
                value={maxPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  if (Number(value) < 0) return;
                  setMaxPrice(e.target.value)
                }}
                className="w-full border-2 border-green-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={applyPriceFilter}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-101 cursor-pointer"
            >
              Apply
            </button>
            {(minPrice || maxPrice) && (
              <button
                onClick={clearPriceFilter}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Active Price Filter Display */}
          {(minPrice || maxPrice) && (
            <div className="mt-3 p-2 bg-white rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 text-center">
                <span className="font-bold text-green-600">
                  ৳{minPrice || "0"} - ৳{maxPrice || "∞"}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductsCategories;
