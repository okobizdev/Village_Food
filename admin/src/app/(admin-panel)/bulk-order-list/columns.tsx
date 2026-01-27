import { confirmation } from "@/components/modals/confirm-modal";
import { TBulkOrder } from "@/types/shared";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate, isValid } from "date-fns";
import React from "react";
import { deleteBulkOrderAction } from "./actions";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<TBulkOrder>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Company Name",
    accessorKey: "companyName",
  },
  {
    header: "Product Type",
    accessorKey: "productType",
  },
  {
    header: "Delivery Date",
    accessorKey: "deliveryDate",
    cell: ({ row }) => {
      const { deliveryDate } = row.original;

      let formattedDate = "-";
      if (deliveryDate) {
        const parsedDate = new Date(deliveryDate);
        if (isValid(parsedDate)) {
          formattedDate = formatDate(parsedDate, "dd/MM/yyyy");
        }
      }

      return <div>{formattedDate}</div>;
    },
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [deleting, setDeleting] = React.useState(false);
      const { _id } = row.original;
      const handleDeleteClick = async () => {
        if (
          await confirmation("Are you sure you want to delete this bulk order?")
        ) {
          setDeleting(true);
          const deleted = await deleteBulkOrderAction(String(_id));
          if (deleted) {
            toast({
              title: "BulkOrder deleted successfully",
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
