import { TUser } from "./user";

export type TCoupon = {
    code: string;
    discount: number;
    useLimit: number;
    used: number;
    startDate: string; // ISO date string
    expireDate: string; // ISO date string
    userInfo: TUser; // Update with specific type if known
    discountType: "category" | "product" | "all"; // assuming possible values
    categoryRef: string;
    _id: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
};