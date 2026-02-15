"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllCategorys = async () => {
  const res = await fetch(`${apiBaseUrl}/category`, {
    next: { revalidate: 3600 },
  });

  return res.json();
};


