
"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50, 100],
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const handleLimitChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const renderPageButtons = () => {
    const pageButtons = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className={`px-3 ${i === currentPage ? "text-white" : "text-primary"
            }`}
        >
          {i}
        </Button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
      <div className="w-full flex flex-col items-center justify-between gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="flex items-center gap-2 text-sm font-medium ">
            <div className="w-[120px]">Rows per page</div>
            <Select
              onValueChange={handleLimitChange}
              value={searchParams.get("limit") || "10"}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((option) => (
                  <SelectItem className="bg-gray-100 cursor-pointer" key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full flex items-center justify-center text-sm font-medium cursor-pointer">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="cursor-pointer"
          // className={currentPage === 1 ? "cursor-not-allowed" : ""}
          >
            <DoubleArrowLeftIcon className="h-4 w-4 " />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          // className={currentPage === 1 ? "!cursor-no-drop " : ""}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="">
            {renderPageButtons()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          // className={currentPage === totalPages ? "cursor-no-drop" : ""}
          >
            <ChevronRightIcon className="h-4 w-4 cursor-pointer" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="cursor-pointer"
          // className={currentPage === totalPages ? "cursor-not-allowed" : ""}
          >
            <DoubleArrowRightIcon className="h-4 w-4 cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
}
