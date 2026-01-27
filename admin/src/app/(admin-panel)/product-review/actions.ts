"use server";

import {
  deleteProductReview,
  updateProductReviewStatus,
} from "@/services/productReview";
import { revalidatePath } from "next/cache";

export async function UpdateFormStatus(id: string, status: boolean) {
  try {
    const res = await updateProductReviewStatus(id, status);
    if (res) {
      revalidatePath("/");

      return { success: true, data: res };
    }
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function deleteReviewAction(id: string) {
  try {
    await deleteProductReview(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
