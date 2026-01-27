"use server";

import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/services/product";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {

    const inventoryType = data.get("inventoryType");

    const inventoryEntries = data.getAll("inventories") as string[];
    const parsed = inventoryEntries.map((inv) => JSON.parse(inv));

    let inventoryArray: any[] = [];

    if (inventoryType === "colorLevelInventory") {
      // Group by level for color-level inventory
      const grouped: Record<string, any[]> = {};
      parsed.forEach((item) => {
        const level = item.size;
        if (!grouped[level]) grouped[level] = [];
        grouped[level].push({
          color: item.colorName,
          colorCode: item.color,
          quantity: item.quantity,
          barcode: item.barcode || "",
        });
      });

      inventoryArray = Object.entries(grouped).map(([level, colorLevel]) => ({
        level,
        colorLevel,
      }));
    } else if (inventoryType === "colorInventory") {
      // Direct color-based entries
      inventoryArray = parsed.map((item) => ({
        color: item.colorName,
        colorCode: item.color,
        quantity: item.quantity,
        barcode: item.barcode || "",
      }));
    } else if (inventoryType === "levelInventory") {
      // Direct size/level-based entries
      inventoryArray = parsed.map((item) => ({
        level: item.size,
        quantity: item.quantity,
        barcode: item.barcode || "",
      }));
    } else if (inventoryType === "inventory") {
      // Simple inventory — single quantity
      inventoryArray = parsed.map((item) => ({
        quantity: item.quantity,
        barcode: item.barcode || "",
      }));
      // Also set raw quantity for simplified access
      data.set("inventory", parsed[0]?.quantity || "0");
    }

    data.delete("inventories");
    data.set("inventoryArray", JSON.stringify(inventoryArray));


    await createProduct(data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    console.error("Create product error:", error);
    throw new Error(error?.message || "Failed to create product");
  }
}

export async function updateFormAction(id: string, data: FormData) {
  try {
    const inventoryType = data.get("inventoryType");
    const inventoryEntries = data.getAll("inventories") as string[];
    const parsed = inventoryEntries.map((inv) => JSON.parse(inv));

    let inventoryArray: any[] = [];

    if (inventoryType === "colorLevelInventory") {
      const grouped: Record<string, any[]> = {};
      parsed.forEach((item) => {
        const level = item.size;
        if (!grouped[level]) grouped[level] = [];
        grouped[level].push({
          color: item.colorName,
          colorCode: item.color,
          quantity: item.quantity,
          barcode: item.barcode || "",
        });
      });

      inventoryArray = Object.entries(grouped).map(([level, colorLevel]) => ({
        level,
        colorLevel,
      }));
    } else if (inventoryType === "colorInventory") {
      inventoryArray = parsed.map((item) => ({
        color: item.colorName,
        colorCode: item.color,
        quantity: item.quantity,
        barcode: item.barcode || "",
      }));
    } else if (inventoryType === "levelInventory") {
      inventoryArray = parsed.map((item) => ({
        level: item.size,
        quantity: item.quantity,
        barcode: item.barcode || "",
      }));
    } else if (inventoryType === "inventory") {
      inventoryArray = parsed.map((item) => ({
        quantity: item.quantity,
        barcode: item.barcode || "",
      }));
      data.set("inventory", parsed[0]?.quantity || "0");
    }

    // data.delete("inventories");
    // data.set("inventoryArray", JSON.stringify(inventoryArray));

    const updatedFormData = new FormData();

    for (const [key, value] of data.entries()) {
      if (key === "inventories") continue;
      updatedFormData.append(key, value);
    }

    updatedFormData.append("inventoryArray", JSON.stringify(inventoryArray));


    await updateProduct(id, updatedFormData);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    console.error("Update product error:", error);
    throw new Error(error?.message || "Failed to update product");
  }
}

export async function deleteProductAction(id: string) {
  // const product = await getProductById(id);

  try {
    await deleteProduct(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    console.error("Delete product error:", error);
    throw new Error(error?.message || "Failed to delete product");
  }
}
