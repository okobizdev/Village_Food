import { z } from "zod";

export const couponFormSchema = z.object({
  code: z.string().min(1),
  discount: z.string().min(1),
  type: z.enum(["percent", "flat"], {
    required_error: "Discount type is required",
    invalid_type_error: "Discount type must be 'percent' or 'fixed'",
  }),
  useLimit: z.string().optional(),
  startDate: z.date().optional(),
  expireDate: z.date().optional(),
  discountType: z.string().min(1),
  categoryRef: z.string().optional(),
  brandRef: z.string().optional(),
  subCategoryRef: z.string().optional(),
});
