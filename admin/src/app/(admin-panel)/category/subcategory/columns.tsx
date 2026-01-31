import { TSubCategory } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { SubCategoryDetailsSheet } from "./details";
import { fileUrlGenerator, makeBDPrice, truncateText } from "@/utils/helpers";
import React from "react";
import { upperCase, upperFirst } from "lodash";

export const columns: ColumnDef<TSubCategory>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
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
    header: "Action",
    cell: ({ row }) => {
      return <SubCategoryDetailsSheet subCategory={row.original} />;
    },
  },
];
