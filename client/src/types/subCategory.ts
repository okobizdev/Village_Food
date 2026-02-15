import { TChildCategory } from "./childCategory";

export type TSubCategory = {
    _id: string;
    name: string;
    image: string;
    bannerImage: string;
    slug: string;
    status: boolean;
    categoryRef: string;
    createdAt: string;
    updatedAt: string;
    childCategories?: TChildCategory[];
    __v: number;
};
