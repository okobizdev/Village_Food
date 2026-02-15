
import { CartItem } from "./cartItem";
import { TSubCategory } from "./subCategory";

export type TMenuCategory = {
  name: string;
  slug: string;
  subCategories: TSubCategory[];
};

export type TMenuItem = TMenuCategory[];

export type TBanner = {
  _id: string;
  image: string;
  type: string;
};

export type TResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: any;
};

export type TCartDetails = {
  cartDetails: CartItem[];
  couponDiscount: number;
  productDiscount: number;
  totalPrice: number;
  totalSaved: number;
};

export type TReview = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  status: boolean;
};

export type TPagination = {
  currentPage: number;
  currentPageLimit: number;
  total: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
};

export type TProductReviewsResponse = {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: {
    pagination: TPagination;
    result: TReview[];
  };
};

export type TCorrelation = {
  id: string;
  name: string;
  email: string;
  roleRef: string;
  role: string;
  warehouseRef: null;
  warehouse: null;
};



