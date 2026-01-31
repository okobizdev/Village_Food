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
  SheetTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, MoreHorizontal, Paperclip, Plus, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { deleteProductAction, updateFormAction } from "./actions";
import { confirmation } from "@/components/modals/confirm-modal";
import { productFormSchema } from "./form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, UploadFile } from "antd";
import { fileUrlGenerator, humanFileSize } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import { getAllSubCategory } from "@/app/(admin-panel)/category/subcategory/sub-category";
import { getAllChildCategory } from "@/app/(admin-panel)/category/childcategory/child-category";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { discountTypes, inventoryTypes } from "./form";
import { Label } from "@/components/ui/label";
import { upperCase, upperFirst } from "lodash";
import { TCategory } from "../category/category/types";
import { TSubCategory } from "../category/subcategory/types";
import { getAllCategory } from "../category/category/service";
import { TProduct } from "./types";
import { TChildCategory } from "../category/childcategory/types";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

interface Props {
  product: TProduct;
}

export const ProductDetailsSheet: React.FC<Props> = ({ product }) => {

  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [optionalFileList, setOptionalFileList] = useState<UploadFile<any>[]>(
    product.optionalImages?.map((item, index) => ({
      uid: `-${index + 1}`,
      name: String(item).split("/").pop() || `image-${index + 1}`,
      status: "done",
      url: item,
    })) || []
  );

  const [thumbnailFileList, setThumbnailFileList] = useState<
    UploadFile<any>[]
  >([
    {
      uid: "-1",
      name: String(product.thumbnailImage).split("/").pop() || "",
      status: "done",
      url: product.thumbnailImage || "",
    },
  ]);

  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = useState<TSubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<
    TChildCategory[]
  >([]);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      videoUrl: product.videoUrl,
      discountType: product.discountType || "",
      discount: String(product.discount) || "",
      mrpPrice: String(product.mrpPrice),
      freeShipping: String(product.freeShipping),
      categoryRef: product.categoryRef?._id,
      subCategoryRef: product.subCategoryRef?._id,
      childCategoryRef: product.childCategoryRef?._id,
      inventoryType: product.inventoryType,
      thumbnailImage: product.thumbnailImage ? [product.thumbnailImage] : [],
      optionalImages: product.optionalImages || [],
      inventories: product.inventoryRef?.length
        ? product.inventoryRef.map((item: any) => ({
          quantity: String(item.quantity),
          ...(item.level && { size: upperCase(item.level) }),
        }))
        : [{ quantity: product.mainInventory }],
    },
  });

  const selectedCategoryId = form.watch("categoryRef");
  const selectedSubCategoryId = form.watch("subCategoryRef");

  const { control, register, watch, formState } = form;
  const selectedInventoryType = watch("inventoryType");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventories",
  });

  const getDefaultInventory = () => {
    const base = { quantity: "" };
    if (selectedInventoryType === "levelInventory")
      return { ...base, size: "" };
    return base;
  };


  useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);

  useEffect(() => {
    getAllChildCategory().then((data) => setChildCategories(data.data));
  }, []);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(
      (subCat) => subCat?.categoryRef?._id === selectedCategoryId
    );
  }, [subCategories, selectedCategoryId]);

  const filteredChildCategories = useMemo(() => {
    return childCategories.filter(
      (childCat) => childCat?.subCategoryRef?._id === selectedSubCategoryId
    );
  }, [childCategories, selectedSubCategoryId]);



  const handleOptionalFileChange = ({ fileList }: any) => {
    setOptionalFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("optionalImages", rawFiles);
  };

  const handleThumbnailFileChange = ({ fileList }: any) => {
    setThumbnailFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);
    // Sync with react-hook-form
    form.setValue("thumbnailImage", rawFiles);
  };

  const onSubmitUpdate = async (values: z.infer<typeof productFormSchema>) => {
    setUpdating(true);

    try {

      const formData = new FormData();
      // Upload Thumbnail (Required
      let thumbnailUrl = product.thumbnailImage;

      if (values.thumbnailImage?.[0] instanceof File) {
        const upload = await uploadImageToCloudinary(
          values.thumbnailImage[0],
          "products/thumbnails"
        );
        thumbnailUrl = upload.secure_url;
      }

      // Upload Optional Images
      let optionalUrls: string[] = [];

      if (values.optionalImages?.length) {
        optionalUrls = await Promise.all(
          values.optionalImages.map(async (file: any) => {
            if (file instanceof File) {
              const upload = await uploadImageToCloudinary(
                file,
                "products/optional"
              );
              return upload.secure_url;
            }
            return file; // existing url
          })
        );
      }

      // Append Text Fields
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("videoUrl", values.videoUrl || "");
      formData.append("discountType", values.discountType || "");
      formData.append("discount", values.discount || "0");
      formData.append("mrpPrice", values.mrpPrice);
      formData.append("freeShipping", values.freeShipping || "false");
      formData.append("categoryRef", values.categoryRef);
      formData.append("subCategoryRef", values.subCategoryRef || "");
      formData.append("childCategoryRef", values.childCategoryRef || "");
      formData.append("inventoryType", values.inventoryType);
      // Inventories
      values.inventories.forEach((inv) => {
        formData.append("inventories", JSON.stringify(inv));
      });
      // Append Images URL
      if (thumbnailUrl) formData.append("thumbnailImage", thumbnailUrl);
      optionalUrls.forEach((url, i) => {
        formData.append(`optionalImages[[${i}]]`, url);
      });


      await updateFormAction(String(product._id), formData);
      toast({
        title: "Product updated successfully",
      });
      setSheetOpen(false);
      setOptionalFileList([]);
      setThumbnailFileList([]);
    } catch (error: any) {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this product?")) {
      setDeleting(true);
      const deleted = await deleteProductAction(String(product._id));
      if (deleted) {
        toast({
          title: "Product deleted successfully",
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
        className="sm:max-w-[1050px] overflow-y-auto bg-white "
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Product Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-3 gap-2 py-2"
          >
            {/* Text Inputs */}
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product videoUrl" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.videoUrl?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter product description" {...field} /> */}
                      <ReactQuill {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.description?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-1">
                <FormField
                  control={form.control}
                  name="mrpPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MRP (Maximum Retail Price){" "}
                        <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter MRP price" {...field} />
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.mrpPrice?.message}
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="freeShipping"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Free Shipping</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={String(field.value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select free shipping?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.freeShipping?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountType"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Discount Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select discount type" />
                            </SelectTrigger>
                            <SelectContent>
                              {discountTypes.map((type) => (
                                <SelectItem
                                  key={type.key}
                                  value={String(type.key)}
                                >
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.discountType?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter discount amount" {...field} />
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.discount?.message}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>
                          Category <b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.categoryRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategoryRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredSubCategories.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.subCategoryRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="childCategoryRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Child Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select child category" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredChildCategories.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.childCategoryRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inventoryType"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>
                          Inventory Type <b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select inventory type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryTypes.map((type) => (
                                <SelectItem
                                  key={type.key}
                                  value={String(type.key)}
                                >
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.inventoryType?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              {selectedInventoryType !== "" &&
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-4 gap-1 border p-2 mb-2 rounded-md space-y-2 relative justify-center items-center"
                  >
                    {selectedInventoryType === "levelInventory" && (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter size"
                            {...register(`inventories.${index}.size`)}
                          />
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {
                            formState.errors?.inventories?.[index]?.size
                              ?.message
                          }
                        </FormDescription>
                      </FormItem>
                    )}

                    {selectedInventoryType !== "" && (
                      <FormItem>
                        <FormLabel>
                          Quantity <b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter quantity"
                            {...register(`inventories.${index}.quantity`)}
                          />
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {
                            formState.errors?.inventories?.[index]?.quantity
                              ?.message
                          }
                        </FormDescription>
                      </FormItem>
                    )}

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

              {selectedInventoryType !== "inventory" &&
                selectedInventoryType !== "" && (
                  <Button
                    type="button"
                    onClick={() => append(getDefaultInventory())}
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                )}

              <div className="m-4 flex gap-2">
                <Button
                  // disabled
                  type="submit"
                  variant="default"
                  loading={updating}
                  className="text-white cursor-pointer"
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  loading={deleting}
                  className="text-white cursor-pointer bg-red-500"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="col-span-1 min-h-[500px] grid grid-cols-2">
              <div className="">
                <Label>
                  Thumbnail Image (Max 1 File) <b className="text-red-500">*</b>
                </Label>
                <FormField
                  control={form.control}
                  name="thumbnailImage"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={thumbnailFileList}
                        onChange={handleThumbnailFileChange}
                        multiple={false}
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
                  {form.getValues("thumbnailImage") &&
                    form.getValues("thumbnailImage").length > 0 &&
                    form.getValues("thumbnailImage").map((file, i) => (
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
                  {form.formState.errors.thumbnailImage?.message}
                </div>
              </div>

              <div className="">
                <Label>Optional Images</Label>
                <FormField
                  control={form.control}
                  name="optionalImages"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={optionalFileList}
                        onChange={handleOptionalFileChange}
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
                  {form.getValues("optionalImages") &&
                    form.getValues("optionalImages").length > 0 &&
                    form.getValues("optionalImages").map((file, i) => (
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
                  {form.formState.errors.optionalImages?.message}
                </div>
              </div>

            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
