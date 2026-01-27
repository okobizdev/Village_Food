"use server";

import {
  createCoupon,
  deleteCoupon,
  getCouponById,
  updateCoupon,
} from "@/services/coupon";
import { TCoupon } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {

    await createCoupon(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {

    await updateCoupon(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteCouponAction(id: string) {
  const coupon = await getCouponById(id);


  try {
    await deleteCoupon(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
