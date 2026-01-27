"use server";

import { BASE_URL } from "@/config/config";
import {
  AllProductResponse,
  AllProductWithPaginationResponse,
  SingleProductResponse,
  TProduct,
} from "@/types/shared";

export async function createProduct(data: any) {

  const response = await fetch(`${BASE_URL}/product`, {
    method: "POST",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getAllProduct(): Promise<AllProductResponse> {
  const response = await fetch(`${BASE_URL}/product`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getProductWithPagination(
  page?: string,
  limit?: string
): Promise<AllProductWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/product/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getProductById(
  id: string
): Promise<SingleProductResponse> {
  const response = await fetch(`${BASE_URL}/product/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateProduct(id: string, data: any) {
  const response = await fetch(`${BASE_URL}/product/${id}`, {
    method: "PUT",
    body: data,
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await fetch(`${BASE_URL}/product/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
