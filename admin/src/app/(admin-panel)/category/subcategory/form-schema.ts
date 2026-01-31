import { z } from "zod";

export const subCategoryFormSchema = z.object({
  name: z.string().min(1),
  categoryRef: z.string().nonempty("Category is required"),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 8,
  multiple: false,
};
