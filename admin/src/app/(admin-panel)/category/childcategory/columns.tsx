
import { ColumnDef } from "@tanstack/react-table";
import { ChildCategoryDetailsSheet } from "./details";
import { truncateText } from "@/utils/helpers";
import React from "react";
import { upperFirst } from "lodash";
import { TChildCategory } from "./types";

export const columns: ColumnDef<TChildCategory>[] = [
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
          <p>{upperFirst(row.original.subCategoryRef?.name)}</p>
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <ChildCategoryDetailsSheet childCategory={row.original} />;
    },
  },
];
