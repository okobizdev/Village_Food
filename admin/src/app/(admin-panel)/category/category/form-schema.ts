import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name is too long" }),

  // image: z
  //   .array(z.instanceof(File))
  //   .min(1, { message: "Image is required" })
  //   .max(1, { message: "Only one image allowed" }),

  // vectorImage: z
  //   .array(z.instanceof(File))
  image: z
    .array(
      z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
        message: "File size must be less than 8 MB",
      })
    )
    .optional()
    .default([]),
  vectorImage: z
    .array(
      z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
        message: "File size must be less than 8 MB",
      })
    )
    .optional()
    .default([]),
});
