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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./form-schema";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { createFormAction } from "./actions";
import { uploadImageToCloudinary } from "@/utils/cloudinary";

const defaultValues = {
  name: "",
  image: [],
};

export const CreateForm: React.FC = () => {
  const { toast } = useToast();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleImageFileChange = ({ fileList }: any) => {
    const latestFileList = fileList.slice(-1);

    setFileList(latestFileList);

    const rawFiles = latestFileList
      .map((f: any) => f.originFileObj)
      .filter(Boolean);

    form.setValue("image", rawFiles);

  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {

      // Image upload to Cloudinary
      const imageFile = values.image[0];
      const imageUploadResult = await uploadImageToCloudinary(imageFile, "categories");


      // FormData 
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("image", imageUploadResult.secure_url);
      formData.append("imagePublicId", imageUploadResult.public_id);

      await createFormAction(formData);
      form.reset();
      setFileList([]);
      toast({
        title: "Success",
        description: "Coupon created successfully",
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
      <Label className="text-xl font-semibold mb-4">Create Category</Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-2">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
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

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Image <b className="text-red-500">*</b>
                  </FormLabel>
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={handleImageFileChange}
                    maxCount={1}
                  >
                    {fileList.length < 1 && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Image</div>
                      </div>
                    )}
                  </Upload>
                </FormItem>
              )}
            />

          </div>

          <Button type="submit" size="lg" disabled={loading} className="!text-white cursor-pointer">
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
