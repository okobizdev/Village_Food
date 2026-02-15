"use server";

import { apiRequest } from "@/lib/apiRequest";

export const addOrder = async (order: any) => {
  // Only send fields that backend expects (prevent accidental status override)
  const { status, ...cleanedOrder } = order;

  const res = await apiRequest({
    endpoint: "/order",
    method: "POST",
    body: cleanedOrder,
  });
  return res;
};
