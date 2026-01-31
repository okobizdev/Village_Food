export type TCategory = {
    _id: string;
    name: string;
    image: string;
    imagePublicId?: string;
    vectorImage: string;
    vectorImagePublicId?: string;
    slug: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    priority?: boolean;
};


export type AllCategoryResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TCategory[];
};

export type AllCategoryWithPaginationResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: {
        result: TCategory[];
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

export type SingleCategoryResponse = {
    statusCode: number;
    status: string;
    message: string;
    data: TCategory;
};