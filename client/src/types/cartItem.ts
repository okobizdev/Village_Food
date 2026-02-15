import { TInventoryRef } from "./Inventory";
import { TProduct } from "./product";

export type CartItem = {
    _id: string;
    cartId: string;
    quantity: number;
    product: TProduct;
    inventory: TInventoryRef;
    subtotal: number;
    productDiscount: number;
    savedAmount: number;
};