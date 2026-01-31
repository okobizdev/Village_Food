
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { BannerDetailsSheet } from "./details";
import { TBanner } from "./types";


export const columns: ColumnDef<TBanner>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Media",
    accessorKey: "image",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.image && (
            <Image
              src={row.original.image}
              alt="Banner Image"
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
    header: "Action",
    cell: ({ row }) => {
      return <BannerDetailsSheet banner={row.original} />;
    },
  },
];
