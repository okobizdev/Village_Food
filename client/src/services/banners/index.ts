"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllBanners = async () => {
  const res = await fetch(`${apiBaseUrl}/banners`, {
    next: { revalidate: 3600 },
  });

  return res.json();
};

