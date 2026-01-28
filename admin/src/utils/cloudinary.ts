import { BASE_URL } from "@/config/config";

export type TCloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};


export const uploadImageToCloudinary = async (
  file: File,
  folder: string = "misc"
): Promise<TCloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/cloudinary/upload?folder=${folder}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed`);
  }

  return await res.json();
};


export const deleteImageFromCloudinary = async (imagePublicId: string | undefined) => {
  const res = await fetch(`${BASE_URL}/cloudinary/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imagePublicId: imagePublicId }),
  });

  if (!res.ok) {
    throw new Error("Image delete failed");
  }

  return await res.json();
};
