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
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MoreHorizontal,
  Paperclip,
  FileUp,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteAction, updateFormAction } from "./actions";
import { confirmation } from "@/components/modals/confirm-modal";
import { formSchema } from "./form-schema";
import { Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { humanFileSize } from "@/utils/helpers";
import { Label } from "@/components/ui/label";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "@/utils/cloudinary";
import { TCategory } from "./types";

interface Props {
  item: TCategory;
}

export const DetailsSheet: React.FC<Props> = ({ item }) => {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [imageFileList, setImageFileList] = useState<UploadFile<any>[]>([
    {
      uid: "-1",
      name: String(item.image).split("/").pop() || "",
      status: "done",
      url: item.image,
    },
  ]);



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      image: [],
    },
  });

  const handleImageFileChange = ({ fileList }: any) => {
    setImageFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };



  const onSubmitUpdate = async (values: z.infer<typeof formSchema>) => {
    setUpdating(true);

    try {

      let imageUrl = item.image;
      let imagePublicId = item.imagePublicId || "";

      // new image upload
      if (values.image && values.image.length > 0) {
        // old image delete
        if (item.imagePublicId) {
          await deleteImageFromCloudinary(item.imagePublicId);
        }

        // new image upload
        const uploadResult = await uploadImageToCloudinary(
          values.image[0],
          "categories"
        );
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;
      }


      // FormData
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", imageUrl);
      formData.append("imagePublicId", imagePublicId);

      await updateFormAction(String(item._id), formData);
      toast({
        title: "Category updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this item?")) {
      setDeleting(true);

      try {

        if (item.imagePublicId) {
          await deleteImageFromCloudinary(item.imagePublicId);
        }

        if (item.vectorImagePublicId) {
          await deleteImageFromCloudinary(item.vectorImagePublicId);
        }

        const deleted = await deleteAction(String(item._id));
        if (deleted) {
          toast({
            title: "Category deleted successfully",
          });
          setSheetOpen(false);
        }

      } catch (error: any) {
        toast({
          title: "Failed to delete item",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setDeleting(false);
      }

    }
    setDeleting(false);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-[750px] overflow-y-auto bg-white"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Category Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-2 gap-4 items-end py-4"
          >
            {/* Name Field */}
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Image */}
            <div className="col-span-1 grid grid-cols-2">
              <div className="">
                <Label>
                  Image <b className="text-red-500">*</b>
                </Label>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={imageFileList}
                        onChange={handleImageFileChange}
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
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex gap-3 mt-4">
              <Button type="submit" variant="default" loading={updating} className="cursor-pointer text-white">
                Update
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteClick}
                loading={deleting}
                className="cursor-pointer bg-red-600 text-white"
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
