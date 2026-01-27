export interface TProduct {
  _id: string;
  name: string;
  slug: string;
  thumbnailImage: string;
  backViewImage?: string;
  images: string[];
  price: number;
  mrpPrice: number;
  discount: number;
  discountType: string;
  discountAmount: number;
  description: string;
  inventoryType: string;
  inventoryRef: any[];
  mainInventory: number;
  productId: string;
  sizeChartImage?: string;
  videoUrl?: string;
  subCategoryRef?: any;
  freeShipping: boolean;
  productDiscount?: number; // Add missing properties
  inventory?: any; // Add missing properties
  warehousePrice?: number; // Add missing properties
  warehouseProfit?: number; // Add missing properties
  wholesalePrice?: number; // Add missing properties
  wholesaleProfit?: number; // Add missing properties
  brandRef?: any; // Add missing properties
  categoryRef?: any; // Add missing properties
  // Add other missing properties as needed
}