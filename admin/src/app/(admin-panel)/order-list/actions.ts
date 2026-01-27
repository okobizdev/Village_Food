"use server";

import { createSteadfastOrder } from "@/services/courier";
import { deleteOrder, updateOrderStatus } from "@/services/order";
import { SteadfastOrderPayload } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function UpdateOrderStatus(orderId: string, status: string) {
  try {
    const statusEntry = { status: status };
    const res = await updateOrderStatus(String(orderId), statusEntry);


    revalidatePath("/");
    return { success: true, data: res };
  } catch (error: any) {
    console.log(error.message);
    throw new error(error.message);
  }
}

export async function SendOrderToSteadfast(courierData: SteadfastOrderPayload) {
  try {
    const response = await createSteadfastOrder(courierData);

    revalidatePath("/");
    return { success: true, data: response };
  } catch (error: any) {
    console.log(error.message);
    throw new error(error.message);
  }
}

export async function deleteOrderAction(id: string) {
  try {
    await deleteOrder(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
