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

export type AllSubCategoryResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TSubCategory[];
};

export type AllSubCategoryWithPaginationResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: {
        result: TSubCategory[];
        pagination: {
            currentPage: number;
            currentPageLimit: number;
            total: number;
            totalPage: number;
            prevPage: number | null;
            prevPageLimit: number;
            nextPage: number | null;
            nextPageLimit: number;
        };
    };
};