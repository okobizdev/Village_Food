import { TProductReview } from "@/types/shared";
import { fileUrlGenerator } from "@/utils/helpers";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { StatusSwitchForm } from "./form";
import { Button } from "@/components/ui/button";
import { confirmation } from "@/components/modals/confirm-modal";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { deleteReviewAction } from "./actions";

export const columns: ColumnDef<TProductReview>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Image",
    accessorKey: "image",
    cell: ({ row }) => {
      const { image, name } = row.original;
      return (
        <div>
          {image ? (
            <Image
              src={fileUrlGenerator(image)}
              alt={name}
              width={200}
              height={200}
            />
          ) : (
            // fileUrlGenerator(image)
            "N/A"
          )}
        </div>
      );
    },
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Rating",
    accessorKey: "rating",
  },
  {
    header: "Comment",
    accessorKey: "comment",
  },
  {
    header: "User",
    accessorKey: "userRef",
    cell: ({ row }) => {
      const { userRef } = row.original;
      return <div>{userRef?.name}</div>;
    },
  },
  {
    header: "Product",
    accessorKey: "productRef",
    cell: ({ row }) => {
      const { productRef } = row.original;
      return <div>{productRef?.name}</div>;
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const { status, _id } = row.original;
      return <StatusSwitchForm id={_id} status={status} />;
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [deleting, setDeleting] = React.useState(false);
      const { _id } = row.original;
      const handleDeleteClick = async () => {
        if (
          await confirmation("Are you sure you want to delete this review?")
        ) {
          setDeleting(true);
          const deleted = await deleteReviewAction(String(_id));
          if (deleted) {
            toast({
              title: "Review deleted successfully",
            });
          }
        }
        setDeleting(false);
      };
      return (
        <div>
          <Button
            loading={deleting}
            onClick={handleDeleteClick}
            variant="destructive"
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
