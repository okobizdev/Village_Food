
import { TCategory } from "./category";
import { TChildCategory } from "./childCategory";
import { TInventoryRef } from "./Inventory";
import { TSubCategory } from "./subCategory";

export type TProduct = {
  [key: string]: any;
  productDiscount: any;
  inventory: any;
  cartDetails?: any;
  data?: any;
  message?: string | undefined;
  _id: string;
  productId: string;
  name: string;
  description: string;
  discountType: "percent" | "flat" | string;
  discount: number;
  discountAmount: number;
  bannerImage?: string;
  price: number;
  mrpPrice: number;
  totalPrice?: number | undefined;
  thumbnailImage: string;
  backViewImage: string;
  sizeChartImage: string;
  images: string[];
  videoUrl: string;
  slug: string;
  freeShipping: boolean;
  brandRef: string | null;
  mainInventory: number;
  inventoryType:
  "inventory"
  | "colorInventory"
  | "levelInventory"
  | "colorLevelInventory"
  | string;
  inventoryRef: TInventoryRef[];
  categoryRef: TCategory;
  subCategoryRef: TSubCategory;
  childCategoryRef: TChildCategory;
  createdAt: string;
  updatedAt: string;
  productRef?: string;
  quantity?: number;
  couponDiscount?: number;
  __v: number;
};