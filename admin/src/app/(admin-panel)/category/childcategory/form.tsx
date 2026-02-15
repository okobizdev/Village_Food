"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { childCategoryFormSchema } from "./form-schema";
import { makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Label } from "@/components/ui/label";
import "react-quill/dist/quill.snow.css";
import { getAllSubCategory } from "@/app/(admin-panel)/category/subcategory/service";
import { TSubCategory } from "../subcategory/types";


const defaultValues = {
  name: "",
  subCategoryRef: "",
};



export const CreateChildCategoryForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<TSubCategory[]>([]);
  const form = useForm<z.infer<typeof childCategoryFormSchema>>({
    resolver: zodResolver(childCategoryFormSchema),
    defaultValues,
  });

  useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);



  const onSubmit = async (values: z.infer<typeof childCategoryFormSchema>) => {
    setLoading(true);

    try {

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("subCategoryRef", values.subCategoryRef);

      await createFormAction(formData);
      form.reset();
      toast({
        title: "Success",
        description: "ChildCategory created successfully",
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-6 mt-1 p-4 rounded-lg">
      <Label className="text-xl font-semibold mb-4">Create ChildCategory</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                    <Input placeholder="Enter childCategory name" {...field} />
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

            <Button type="submit" loading={loading} className="my-6 cursor-pointer text-white">
              Create
            </Button>
          </div>

        </form>
      </Form>
    </Card>
  );
};
