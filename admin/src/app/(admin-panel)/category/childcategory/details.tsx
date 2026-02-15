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
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteChildCategoryAction, updateFormAction } from "./actions";
import { confirmation } from "@/components/modals/confirm-modal";
import { childCategoryFormSchema } from "./form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, UploadFile } from "antd";
import { fileUrlGenerator, humanFileSize, makeFormData } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { getAllSubCategory } from "@/app/(admin-panel)/category/subcategory/service";
import { TChildCategory } from "./types";
import { TSubCategory } from "../subcategory/types";

interface Props {
  childCategory: TChildCategory;
}

export const ChildCategoryDetailsSheet: FC<Props> = ({
  childCategory,
}) => {

  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [subCategories, setSubCategories] = useState<TSubCategory[]>([]);
  const form = useForm<z.infer<typeof childCategoryFormSchema>>({
    resolver: zodResolver(childCategoryFormSchema),
    defaultValues: {
      name: childCategory.name,
      subCategoryRef: childCategory.subCategoryRef?._id,
    },
  });

  useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);


  const onSubmitUpdate = async (
    values: z.infer<typeof childCategoryFormSchema>
  ) => {
    setUpdating(true);
    try {

      const data = new FormData();
      data.append("name", values.name);
      data.append("subCategoryRef", values.subCategoryRef);

      await updateFormAction(String(childCategory._id), data);
      toast({
        title: "ChildCategory updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update childCategory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      await confirmation("Are you sure you want to delete this childCategory?")
    ) {
      setDeleting(true);

      const deleted = await deleteChildCategoryAction(
        String(childCategory._id)
      );
      if (deleted) {
        toast({
          title: "ChildCategory deleted successfully",
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
        className="sm:max-w-[750px] overflow-y-auto bg-white "
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>ChildCategory Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-3 gap-2 py-2"
          >
            {/* Text Inputs */}
            <div className="col-span-2 grid grid-cols-3 justify-center items-start gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter childCategory name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subCategoryRef"
                render={({ field }) => (
                  <div className="flex items-end gap-2 w-full">
                    <FormItem className="flex-1">
                      <FormLabel>
                        Subcategory <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {subCategories.map((item, index) => (
                              <SelectItem key={index} value={String(item._id)}>
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

              <div className="m-4 flex gap-2">
                <Button type="submit" variant="default" loading={updating} className="text-white cursor-pointer" >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  loading={deleting}
                  className="text-white cursor-pointer bg-red-500 "
                >
                  Delete
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
