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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteSubCategoryAction, updateFormAction } from "./actions";
import { TSubCategory } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";
import { subCategoryFormSchema } from "./form-schema";
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
import { TCategory } from "../category/types";
import { getAllCategory } from "../category/service";

interface Props {
  subCategory: TSubCategory;
}

export const SubCategoryDetailsSheet: React.FC<Props> = ({ subCategory }) => {

  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const form = useForm<z.infer<typeof subCategoryFormSchema>>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      name: subCategory.name,
      categoryRef: subCategory.categoryRef?._id,
    },
  });

  useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  const onSubmitUpdate = async (
    values: z.infer<typeof subCategoryFormSchema>
  ) => {
    setUpdating(true);
    const data = makeFormData(values);
    try {
      await updateFormAction(String(subCategory._id), data);
      toast({
        title: "SubCategory updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update subCategory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      await confirmation("Are you sure you want to delete this subCategory?")
    ) {
      setDeleting(true);

      const deleted = await deleteSubCategoryAction(String(subCategory._id));
      if (deleted) {
        toast({
          title: "SubCategory deleted successfully",
        });
        setSheetOpen(false);
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
          <SheetTitle>SubCategory Details</SheetTitle>
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
                      <Input placeholder="Enter subCategory name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
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
                              <SelectItem key={index} value={String(item._id)}>
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

              <div className="m-4 flex gap-2">
                <Button type="submit" variant="default" loading={updating} className="cursor-pointer text-white">
                  Update
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  loading={deleting}
                  className="cursor-pointer bg-red-500 text-white"
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
