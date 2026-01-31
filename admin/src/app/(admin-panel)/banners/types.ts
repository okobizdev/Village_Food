import { TPagination } from "@/types/shared";

export type TBanner = {
    _id?: string;
    image?: string;
    files?: File[];
    title?: string;
    details?: string;
    bannerCategory?: string;
    type?: string;
    status?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type AllBannerResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TBanner[];
};

export type AllBannerWithPaginationResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: {
        result: TBanner[];
        pagination: TPagination;
    };
};

export type SingleBannerResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TBanner;
};