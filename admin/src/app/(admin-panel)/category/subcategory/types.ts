import { TCategory } from "../category/types";

export type TSubCategory = {
    _id: string;
    name: string;
    image: string;
    bannerImage?: string;
    viewType?: string;
    slug: string;
    status: boolean;
    categoryRef: TCategory;
    createdAt: string;
    updatedAt: string;
    __v: number;
};