import { ContentLayout } from "@/components/admin-panel/content-layout";
import React from "react";
import { CustomTable } from "./table";
import { CreateForm } from "./form";
import { getCategoryWithPagination } from "./service";

export const revalidate = 0;

interface Props {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function CategoryPage({ searchParams }: Props) {
  const page = Array.isArray(searchParams.page)
    ? searchParams.page[0]
    : searchParams.page || "1";

  const limit = Array.isArray(searchParams.limit)
    ? searchParams.limit[0]
    : searchParams.limit || "10";

  const { data } = await getCategoryWithPagination(page, limit);

  return (
    <ContentLayout title="Category">
      <CreateForm />
      <CustomTable
        data={data.result.map((item) => ({
          ...item,
        }))}
        pagination={{
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.pagination.total,
        }}
      />
    </ContentLayout>
  );
}
