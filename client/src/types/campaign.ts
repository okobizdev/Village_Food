import { TCoupon } from "./coupon";

export type TCampaign = {
    _id: string;
    name: string;
    couponRef: TCoupon;
    createdAt: string;
    updatedAt: string;
    __v: number;
};