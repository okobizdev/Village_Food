export type TInventoryRef = {
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