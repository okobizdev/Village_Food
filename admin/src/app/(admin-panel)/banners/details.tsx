"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  SheetTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, MoreHorizontal, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteBannerAction, updateFormAction } from "./actions";
import { confirmation } from "@/components/modals/confirm-modal";
import { bannerFormSchema } from "./form-schema";
import { Upload, UploadFile } from "antd";
import { fileUrlGenerator, humanFileSize } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/utils/cloudinary";
import { TBanner } from "./types";

interface Props {
  banner: TBanner;
}

export const BannerDetailsSheet: React.FC<Props> = ({ banner }) => {
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([
    {
      uid: "-1",
      name: String(banner.image).split("/").pop() || "",
      status: "done",
      url: banner.image,
    },
  ]);

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };

  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      image: [],
    },
  });

  const onSubmitUpdate = async (values: z.infer<typeof bannerFormSchema>) => {
    setUpdating(true);
    try {
      const formData = new FormData();

      // Only upload new image if user selected one
      if (values.image && values.image.length > 0) {
        const imageFile = values.image[0];
        const imageUploadResult = await uploadImageToCloudinary(imageFile, "banners");
        formData.append("image", imageUploadResult.secure_url);
        formData.append("imagePublicId", imageUploadResult.public_id);
      }

      await updateFormAction(String(banner._id), formData);
      toast({
        title: "Banner updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update banner",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this banner?")) {
      setDeleting(true);
      const deleted = await deleteBannerAction(String(banner._id));
      if (deleted) {
        toast({
          title: "Banner deleted successfully",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer ">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-[750px] overflow-y-auto bg-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Banner Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-2 gap-2 items-end py-2"
          >
            <div className="">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div>
                    <Upload
                      listType="picture-card"
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={handleFileChange}
                    >
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    </Upload>
                  </div>
                )}
              />

              <div className="mt-4">
                {form.getValues("image") &&
                  form.getValues("image").length > 0 &&
                  form.getValues("image").map((file, i) => (
                    <div className="border-dashed border-2 rounded-lg p-2 px-3">
                      <div
                        key={i}
                        className="flex flex-col gap-2 text-xs text-gray-500 justify-center h-full"
                      >
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileUp className="h-4 w-4 stroke-current" />
                          <span>{humanFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="text-red-400 text-xs min-h-4">
                {form.formState.errors.image?.message}
              </div>
            </div>

            <div className="m-4 flex gap-2">
              <Button type="submit" variant="default" loading={updating} className="text-white" >
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
                className=" bg-red-500 text-white"
              >
                Delete
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
