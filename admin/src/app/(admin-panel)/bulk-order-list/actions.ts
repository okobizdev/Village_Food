"use server";

import { deleteBulkOrder } from "@/services/bulk_order";
import { revalidatePath } from "next/cache";

export async function deleteBulkOrderAction(id: string) {
    try {
      await deleteBulkOrder(id);
      revalidatePath("/");
      return true;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }