import { TChildCategory } from "./childCategory";
import { TSubCategory } from "./subCategory";

export type TShopSideBar = {
    _id: string;
    name: string;
    image: string;
    colorCode: string;
    slug: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    subCategories: TSubCategory[];
    subChildCategories: TChildCategory;
};