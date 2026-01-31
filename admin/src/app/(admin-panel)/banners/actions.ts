"use server";

import { revalidatePath } from "next/cache";
import { createBanner, deleteBanner, updateBanner } from "./service";

export async function createFormAction(data: FormData) {
  try {
    await createBanner(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    await updateBanner(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteBannerAction(id: string) {
  try {
    await deleteBanner(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
