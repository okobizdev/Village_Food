import { TCategory } from "../category/category/types";
import { TChildCategory } from "../category/childcategory/types";
import { TSubCategory } from "../category/subcategory/types";

export type TInventory = {
    _id: string;
    quantity: number;
    barcode: string;
    availableQuantity: number;
    soldQuantity: number;
    holdQuantity: number;
    color: string;
    name: string;
    level: string;
    inventoryID: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    productRef: string;
};

export type InventoryEntry = {
    quantity: number;
    size?: string;
};


export type TProduct = {
    _id: string;
    productId: string;
    name: string;
    description?: string;
    discountType?: "flat" | "percent";
    discount?: number;
    discountAmount?: number;
    price: number;
    mrpPrice?: number;
    thumbnailImage: string;
    optionalImages?: string[];
    videoUrl?: string;
    status?: string;
    slug?: string;
    freeShipping: boolean;
    brandRef: string | null;
    mainInventory?: number;
    quantity?: number;
    inventoryType?:
    | "levelInventory"
    | "inventory";
    inventoryRef?: TInventory[];
    categoryRef?: TCategory;
    subCategoryRef?: TSubCategory;
    childCategoryRef?: TChildCategory;
    priority?: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
