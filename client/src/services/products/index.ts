"use server";
import { apiBaseUrl } from "@/config/config";

//  Best Seller
export const getBestSellerProducts = async () => {
  const res = await fetch(`${apiBaseUrl}/product/best-seller`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch best seller products");
  }

  return res.json();
};

//  Best Deal
export const getBestDealProducts = async () => {
  const res = await fetch(`${apiBaseUrl}/product/best-deal`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch best deal products");
  }

  return res.json();
};

//  Popular
export const getPopularProducts = async () => {
  const res = await fetch(`${apiBaseUrl}/product/popular`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch popular products");
  }

  return res.json();
};


export const getAllProductsForShop = async (
  categorySlug?: string,
  subCategorySlug?: string,
  childCategorySlug?: string,
  minPrice?: string,
  maxPrice?: string,
  page?: number,
  limit?: number,
  sortBy?: string
) => {
  const searchParams = new URLSearchParams();

  // Category filters
  if (categorySlug) {
    searchParams.set("categorySlug", categorySlug);
  }

  if (subCategorySlug) {
    searchParams.set("subCategorySlug", subCategorySlug);
  }

  if (childCategorySlug) {
    searchParams.set("childCategorySlug", childCategorySlug);
  }

  // Price filters
  if (minPrice) {
    searchParams.set("minPrice", minPrice);
  }

  if (maxPrice) {
    searchParams.set("maxPrice", maxPrice);
  }

  // Pagination
  if (page) {
    searchParams.set("page", page.toString());
  }

  if (limit) {
    searchParams.set("limit", limit.toString());
  }

  // Sorting
  if (sortBy) {
    searchParams.set("sortBy", sortBy);
  }

  const url = `${apiBaseUrl}/product/pagination?${searchParams.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
};

export const getSingleProductBySlug = async (_id: string) => {
  const res = await fetch(`${apiBaseUrl}/product/${_id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
};

export const getRelativeProducts = async (productId: { productId: string }) => {
  const res = await fetch(`${apiBaseUrl}/product/related-product/${productId}`, {
    next: { revalidate: 3600 },
  });

  return res.json();
};


export const getSearchProducts = async (search: { search: string }) => {
  const res = await fetch(`${apiBaseUrl}/product/search?search=${search?.search}`, {
    next: { revalidate: 3600 },
  });

  return res.json();
};
