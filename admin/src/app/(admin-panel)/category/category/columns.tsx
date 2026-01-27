import { TCategory, TCoupon } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
// import { DetailsSheet } from "./details";
import { BASE_URL } from "@/config/config";
import { DetailsSheet } from "./details";
import { fileUrlGenerator } from "@/utils/helpers";
import { useState } from "react";
export const columns: ColumnDef<TCategory>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Category Name",
    accessorKey: "name",
  },
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => {
      const { image } = row.original;
      return (
        <div className="w-20 h-20 relative">
          <Image
            src={fileUrlGenerator(image)}
            alt="category"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      );
    },
  },
  {
    header: "Vector Image",
    accessorKey: "vectorImage",
    cell: ({ row }) => {
      const { vectorImage } = row.original;
      return (
        <div className="w-20 h-20 relative">
          <Image
            src={fileUrlGenerator(vectorImage)}
            alt="category"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <DetailsSheet item={row.original} />;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const [value, setValue] = useState(row.original.status);

      const togglePriority = async () => {
        setValue(!value);
        try {
          await fetch(`${BASE_URL}/category/status/${row.original._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: !value }),
          });
        } catch (err) {
          console.error("Failed to update status:", err);
        }
      };

      return (
        <button
          onClick={togglePriority}
          className={`px-3 py-1 rounded-md font-bold ${value ? "bg-red-600" : "bg-green-600"
            } text-white`}
        >
          {value ? "High" : "Low"}
        </button>
      );
    },
  }

];
