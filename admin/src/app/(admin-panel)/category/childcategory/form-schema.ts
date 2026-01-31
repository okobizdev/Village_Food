import { z } from "zod";

export const childCategoryFormSchema = z.object({
  name: z.string().min(1),
  subCategoryRef: z.string().nonempty("Subcategory is required"),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 8,
  multiple: false,
};
