"use client";

import { TChildCategory, TShopSideBar, TSubCategory } from "@/types";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopPageSidebarProps {
  shopSideBar: TShopSideBar[];
}

const ShopPageSidebar: React.FC<ShopPageSidebarProps> = ({ shopSideBar }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [selectedChildCategories, setSelectedChildCategories] = useState<string[]>([]);

  useEffect(() => {
    const cats = searchParams.get("category")?.split(",") || [];
    const subCats = searchParams.get("subCategory")?.split(",") || [];
    const childCats = searchParams.get("childCategory")?.split(",") || [];
    setSelectedCategories(cats);
    setSelectedSubCategories(subCats);
    setSelectedChildCategories(childCats);
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
      <ul className="space-y-2">
        {shopSideBar?.map((cat) => (
          <li key={cat._id}>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => updateParams("category", cat.slug)}
                className="accent-[#495588]"
              />
              {cat.name}
            </label>

            <ul className="space-y-1 pl-6 mt-1">
              {Array.isArray(cat.subCategories) && cat.subCategories.map((subCat: TSubCategory) => (
                <li key={subCat._id}>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedSubCategories.includes(subCat.slug)}
                      onChange={() => updateParams("subCategory", subCat.slug)}
                      className="accent-[#495588]"
                    />
                    {subCat.name}
                  </label>

                  <ul className="space-y-1 pl-6 mt-1">
                    {Array.isArray(subCat.childCategories) && subCat.childCategories.map((childCat: TChildCategory) => (
                      <li key={childCat._id}>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={selectedChildCategories.includes(childCat.slug)}
                            onChange={() => updateParams("childCategory", childCat.slug)}
                            className="accent-[#495588]"
                          />
                          {childCat.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShopPageSidebar;
