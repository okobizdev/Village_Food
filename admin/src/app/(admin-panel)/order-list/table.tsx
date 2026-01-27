"use client";

import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@radix-ui/react-label";
import { Card } from "@/components/ui/card";
import { TOrder } from "@/types/shared";
import { columns } from "./columns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface Props {
  data: TOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export const OrderTable: React.FC<Props> = ({ data, pagination }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(pagination.total / pagination.limit),
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
  });

  return (
    <Card className="m-6 rounded-lg w-full">
      <div className="flex justify-between items-center p-4">
        <Label className="text-xl font-semibold">Order List</Label>
      </div>
      
      <div className="border rounded-lg mx-4 mb-4">
        <div className="max-h-[1000px] overflow-auto">
          <Table className="w-auto min-w-full">
            <TableHeader className="sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={
                          (header.column.columnDef.meta as any)?.align
                            ? "h-10 text-white bg-primary whitespace-nowrap text-" +
                              (header.column.columnDef.meta as any)?.align
                            : "h-10 text-white bg-primary whitespace-nowrap"
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className={
                            (cell.column.columnDef.meta as any)?.align
                              ? "py-2 whitespace-nowrap text-" +
                                (cell.column.columnDef.meta as any)?.align
                              : "py-2 whitespace-nowrap"
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </Card>
  );
};