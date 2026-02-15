"use server";

import { BASE_URL } from "@/config/config";
import { AllProductReviewWithPaginationResponse } from "@/types/shared";

export async function getProductReviewWithPagination(
  page?: string,
  limit?: string
): Promise<AllProductReviewWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/product-review/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function updateProductReviewStatus(id: string, status: boolean) {
  const response = await fetch(
    `${BASE_URL}/product-review/status/${id}?status=${status}`,
    {
      method: "PUT",
    }
  );
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteProductReview(id: string) {
  const response = await fetch(`${BASE_URL}/product-review/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
