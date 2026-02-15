import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  discountType: z.string().optional(),
  discount: z.string().optional(),
  mrpPrice: z.string().min(1, "MRP is required"),
  size: z.string().optional(),
  freeShipping: z.string().optional(),
  categoryRef: z.string().nonempty("Category is required"),
  subCategoryRef: z.string().optional(),
  childCategoryRef: z.string().optional(),
  inventoryType: z.string().nonempty("Inventory Type is required"),
  inventories: z.array(
    z.object({
      size: z.string().optional(),
    })
  ),

  thumbnailImage: z
    .array(
      z.union([
        z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
          message: "File size must be less than 8 MB",
        }),
        z.string(),
      ])
    )
    .min(1, {
      message: "Minimum 1 files are allowed",
    }),
  optionalImages: z
    .array(
      z.union([
        z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
          message: "File size must be less than 8 MB",
        }),
        z.string(),
      ])
    )
    .optional()
    .default([]),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 8,
  multiple: false,
};
