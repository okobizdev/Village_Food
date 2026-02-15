"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ProductDetailsSheet } from "./details";
import { makeBDPrice, truncateText } from "@/utils/helpers";
import React, { useState } from "react";
import { upperCase, upperFirst } from "lodash";
import TruncatedHtml from "@/components/utils/truncated-html";
import Barcode from "react-barcode";
import { BASE_URL } from "@/config/config";
import { ProductStatusDropdown } from "@/components/utils/product-status-dropdown";
import { TProduct } from "./types";

export const columns: ColumnDef<TProduct>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Thumbnail Image",
    accessorKey: "thumbnailImage",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.thumbnailImage && (
            <Image
              src={row.original.thumbnailImage}
              alt={row.original.name || ""}
              width={600}
              height={200}
              className="w-32 object-cover"
            />
          )}
        </div>
      );
    },
  },
  {
    header: "Additional Images",
    accessorKey: "optionalImages",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.optionalImages &&
            row.original.optionalImages.map((img: string) => (
              <Image
                src={img}
                alt={row.original.name || ""}
                width={600}
                height={200}
                className="w-32 object-cover mt-1"
              />
            ))}
        </div>
      );
    },
  },
  {
    header: "Barcode",
    cell: ({ row }) => {
      return (
        <div className="w-[300px]">
          <Barcode value={row?.original?._id} className="w-full" />
        </div>
      );
    },
  },
  {
    header: "Name",
    size: 200,
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row?.original?.name || "";
      const [expanded, setExpanded] = React.useState(false);

      const toggleExpanded = () => setExpanded((prev) => !prev);

      const shouldTruncate = name.length > 50;
      const displayedName = expanded ? name : truncateText(name, 50);

      return (
        <div className="w-[200px]">
          <p>{displayedName}</p>
          {shouldTruncate && (
            <button
              onClick={toggleExpanded}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              {expanded ? "See less" : "See more"}
            </button>
          )}
        </div>
      );
    },
  },
  {
    header: "Details",
    size: 250,
    accessorKey: "description",
    cell: ({ row }) => {
      const description = row?.original?.description || "";
      return <TruncatedHtml html={description} maxLength={100} />;
    },
  },
  {
    header: "Discount Type",
    accessorKey: "discountType",
    cell: ({ row }) => <div>{upperFirst(row.original.discountType || "")}</div>,
  },
  {
    header: "Discount",
    accessorKey: "discount",
    cell: ({ row }) => (
      <div>
        {row.original.discountType === "percent" ? (
          <p>{row.original.discount}%</p>
        ) : (
          <p>{row.original.discount}</p>
        )}
      </div>
    ),
  },
  {
    header: "Discount Amount",
    accessorKey: "discountAmount",
    cell: ({ row }) => (
      <div className="w-[60px]">
        {makeBDPrice(row.original.discountAmount || 0)}
      </div>
    ),
  },
  {
    header: "MRP",
    accessorKey: "mrpPrice",
    cell: ({ row }) => (
      <div className="w-[60px]">{makeBDPrice(row.original.mrpPrice || 0)}</div>
    ),
  },
  {
    header: "Price",
    accessorKey: "price",
    cell: ({ row }) => (
      <div className="w-[60px]">{makeBDPrice(row.original.price)}</div>
    ),
  },
  {
    header: "Inventory Type",
    accessorKey: "inventoryType",
    cell: ({ row }) => (
      <div className="">
        {row.original.inventoryType === "levelInventory" && <p>Size</p>}
        {row.original.inventoryType === "inventory" && <p>-</p>}
      </div>
    ),
  },
  {
    header: "Inventory Details",
    accessorKey: "inventoryRef",
    size: 600,
    cell: ({ row }) => {
      return (
        <div className="w-[120px] overflow-x-auto  border p-2 rounded-md">
          {row.original.inventoryRef?.map((item) => (
            <div
              key={item._id}
              className=""
            >
              <div className="flex items-center  gap-2">
                <p>Size: {item.level ? upperCase(item.level) : "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    header: "Category",
    accessorKey: "categoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.categoryRef?.name)}</p>
        </div>
      );
    },
  },
  {
    header: "Subcategory",
    accessorKey: "subCategoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.subCategoryRef?.name)}</p>
        </div>
      );
    },
  },
  {
    header: "Child Category",
    accessorKey: "childCategoryRef",
    cell: ({ row }) => {
      return (
        <div>
          <p>{upperFirst(row.original.childCategoryRef?.name)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <ProductStatusDropdown
          productId={row.original._id}
          currentStatus={row.original.status ?? null}
        />
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <ProductDetailsSheet product={row.original} />;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const [value, setValue] = useState(row.original.priority);

      const togglePriority = async () => {
        setValue(!value);
        try {
          await fetch(`${BASE_URL}/product/${row.original._id}/priority`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ priority: !value }),
          });
        } catch (err) {
          console.error("Failed to update priority:", err);
        }
      };

      return (
        <button
          onClick={togglePriority}
          className={`px-3 py-1 rounded-md font-bold ${value ? "bg-red-600 text-white" : "bg-green-600 text-white"
            }`}
        >
          {value ? "High" : "Low"}
        </button>
      );
    },
  },
];
