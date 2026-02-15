"use server";

import { revalidatePath } from "next/cache";
import { createCategory, deleteCategory, updateCategory } from "./service";

export async function createFormAction(data: FormData) {
  try {
    await createCategory(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
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


  try {
    await deleteCategory(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
