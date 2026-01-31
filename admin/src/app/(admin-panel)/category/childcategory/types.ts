import { TSubCategory } from "../subcategory/types";

export type TChildCategory = {
    _id: string;
    name: string;
    image: string;
    bannerImage?: string;
    viewType?: string;
    slug: string;
    status: boolean;
    subCategoryRef: TSubCategory;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type AllChildCategoryWithPaginationResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: {
        result: TChildCategory[];
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

export type SingleSubCategoryResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TSubCategory;
};

export type SingleChildCategoryResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TChildCategory;
};

export type AllChildCategoryResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TChildCategory[];
};
