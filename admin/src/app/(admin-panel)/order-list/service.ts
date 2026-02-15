"use server";

import { BASE_URL } from "@/config/config";
import {
  AllOrderResponse,
  AllOrderWithPaginationResponse,
  SingleOrderResponse,
} from "@/types/shared";

export async function getAllOrder(): Promise<AllOrderResponse> {
  const response = await fetch(`${BASE_URL}/order`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function getOrderWithPagination(
  page?: string,
  limit?: string
): Promise<AllOrderWithPaginationResponse> {
  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", page);
  if (limit) queryParams.set("limit", limit);

  const response = await fetch(
    `${BASE_URL}/order/pagination?${queryParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
}

export async function getOrderById(id: string): Promise<SingleOrderResponse> {
  const response = await fetch(`${BASE_URL}/order/${id}`);
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function updateOrderStatus(id: string, data: { status: string }) {
  const response = await fetch(`${BASE_URL}/order/status/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

export async function deleteOrder(id: string) {
  const response = await fetch(`${BASE_URL}/order/${id}`, {
    method: "DELETE",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }


  if (!response.ok) {
    // backend message থাকলে ওটাই দেখাবে
    const message =
      data?.message ||
      data?.error ||
      `Error: ${response.status} - ${response.statusText}`;

    throw new Error(message);
  }

  return data;
}
