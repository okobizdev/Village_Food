"use server";

import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from "@/services/category";
import { TCategory } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
     await createCategory(data);
 
    revalidatePath("/");
    return true;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      console.error("Duplicate error:", error.response.data.message);
      throw new Error(error.response.data.message); 
    } else {
      console.error("Something went wrong:", error.message);
      throw new Error(error.message);
    }
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    await updateCategory(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteAction(id: string) {
  // const category = await getCategoryById(id);

  try {
    await deleteCategory(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
