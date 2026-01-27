import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, useToast } from "@/components/ui/use-toast";
import { createSteadfastOrder } from "@/services/courier";
import { SteadfastOrderPayload, TOrder } from "@/types/shared";
import { makeBDPrice, makePrice } from "@/utils/helpers";
import { ColumnDef } from "@tanstack/react-table";
import React, { useRef } from "react";
import { deleteOrderAction, UpdateOrderStatus } from "./actions";
import { useReactToPrint } from "react-to-print";
import PrintInvoice from "@/components/invoice/page";
import { Printer } from "lucide-react";
import { upperCase } from "lodash";
import { confirmation } from "@/components/modals/confirm-modal";

export const orderStatuses = [
  { key: "InOrder", name: "In Order" },
  { key: "Hold", name: "Hold" },
  { key: "Cancelled", name: "Cancelled" },
  { key: "PartialDelivered", name: "Partial Delivered" },
  { key: "Delivered", name: "Delivered" },
  { key: "DeliveredPending", name: "Delivered Pending" },
  { key: "OrderPlaced", name: "Order Placed" },
];

export const columns: ColumnDef<TOrder>[] = [
  {
    header: "SL",
    cell: ({ row }) => row.index + 1,
  },
  {
    header: "Order ID",
    accessorKey: "orderId",
  },
  {
    header: "Products",
    cell: ({ row }) => {
      const { products } = row.original;
      return (
        <div className="w-40 flex flex-col gap-3">
          {products?.map((item, index) => (
            <div key={index} className="p-3 border rounded-md">
              <p>{item?.productRef?.name} </p>
              <p>
                <span className="font-semibold">{item?.productRef?.price}</span>{" "}
                x <span className="font-bold">{item?.quantity}</span>
              </p>
              <p>
                Color:{" "}
                {item?.inventoryRef?.name
                  ? upperCase(item?.inventoryRef?.name)
                  : "N/A"}
              </p>
              <p>
                Size:{" "}
                {item?.inventoryRef?.level
                  ? upperCase(item?.inventoryRef?.level)
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    header: "Subtotal Price",
    accessorKey: "subTotalPrice",
    cell: ({ row }) => {
      return (
        <div className="min-w-[120px]">
          {row.original.subTotalPrice &&
            makeBDPrice(row.original.subTotalPrice)}
        </div>
      );
    },
  },
  {
    header: "Coupon Code",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.couponRef?.code || "N/A"}
        </div>
      );
    },

  },
  {
    header: "Coupon Discount",
    accessorKey: "couponDiscount",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.couponDiscount &&
            makeBDPrice(row.original.couponDiscount)}
        </div>
      );
    },
  },
  {
    header: "Shipping Cost",
    accessorKey: "shippingCost",
    cell: ({ row }) => {
      return (
        <div className="min-w-[120px]">
          {row.original.shippingCost && makeBDPrice(row.original.shippingCost)}
        </div>
      );
    },
  },
  {
    header: "Total Price",
    accessorKey: "totalPrice",
    cell: ({ row }) => {
      return (
        <div className="min-w-[120px]">
          {row.original.totalPrice && makeBDPrice(row.original.totalPrice)}
        </div>
      );
    },
  },
  {
    header: "Payment Method",
    accessorKey: "paymentMethod",
    cell: ({ row }) => {
      const method = row.original.paymentMethod;
      return (
        <div className="flex flex-col">
          <span>{method}</span>
          {method === "MobileBanking" && (
            <>
              <span className="mt-1">Provider: {row.original.mobileBankingProvider || "N/A"}</span>
              <span className="mt-1">Number: {row.original.mobileNumber || "N/A"}</span>
            </>
          )}
        </div>
      );
    },
  },
  // {
  //   header: "User Info",
  //   cell: ({ row }) => {
  //     return (
  //       <div>
  //         <div className="flex justify-between items-center gap-2">
  //           <p>Name: </p>
  //           <p>{row.original.userRef?.name}</p>
  //         </div>
  //         <div className="flex justify-between items-center gap-2">
  //           <p>Phone: </p>
  //           <p>{row.original.userRef?.phone}</p>
  //         </div>
  //         <div className="flex justify-between items-center gap-2">
  //           <p>Email: </p>
  //           <p>{row.original.userRef?.email}</p>
  //         </div>
  //         {row.original.userRef?.isFistOrder && <div>First Order</div>}
  //       </div>
  //     );
  //   },
  // },
  {
    header: "Customer Info",
    cell: ({ row }) => {
      return (
        <div>
          <div className="flex justify-between items-center gap-2">
            <p>Name: </p>
            <p>{row.original.customerName}</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p>Phone: </p>
            <p>{row.original.customerPhone}</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p>Email: </p>
            <p>{row.original.customerEmail}</p>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p>Address: </p>
            <p>{row.original.customerCity},</p>
            <p>{row.original.customerAddress}</p>
          </div>
        </div>
      );
    },
  },
  {
    header: "Order Status",
    accessorKey: "status",
    cell: ({ row }) => {
      console.log(
        row.original.status,
        "row from order status...........54461411321321321321321"
      );
      const rowStatus = orderStatuses.find((r) => {
        return r.key === row?.original?.status;
      });
      return <div>{rowStatus?.name || "N/A"}</div>;
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [loading, setLoading] = React.useState(false);
      const { toast } = useToast();
      const currentStatus = row.original.status;
      const orderId = row.original._id;

      const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;

        setLoading(true);
        try {
          if (orderId) {
            const res = await UpdateOrderStatus(orderId, newStatus);
            if (res.success) {
              toast({
                title: "Success",
                description: `Order status updated to ${newStatus}`,
              });
            }
          }
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to update order status",
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <Select
            disabled={loading}
            defaultValue={currentStatus}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              {orderStatuses.map((status) => (
                <SelectItem key={status.key} value={String(status.key)}>
                  {status.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    header: "Send To Courier",
    cell: ({ row }) => {
      const [loading, setLoading] = React.useState(false);
      const { toast } = useToast();

      const courierData: SteadfastOrderPayload = {
        invoice: row.original.orderId,
        recipient_name: row.original.customerName || "",
        recipient_phone: row.original.customerPhone || "",
        recipient_address: row.original.customerAddress || "",
        cod_amount: row.original.totalPrice || "",
        note: row.original.note,
      };


      const handleClick = async () => {
        setLoading(true);
        try {
          const response = await createSteadfastOrder(courierData);

          if (response) {
            toast({
              title: "Success",
              description: "Order submitted to courier",
            });
          }
        } catch (error: any) {
          console.log(error.message);
          toast({
            title: "Error!",
            variant: "destructive",
            description: error.message,
          });
        } finally {
          setLoading(false);
        }
      };

      return (
        <div>
          <Button loading={loading} onClick={handleClick}>
            Steadfast
          </Button>
        </div>
      );
    },
  },
  {
    header: "Invoice",
    cell: ({ row }) => {
      const orderData = row.original;

      const printerRef = useRef(null);

      const handlePrinter = useReactToPrint({
        content: () => printerRef.current,
      });
      return (
        <div>
          <Button onClick={handlePrinter}>
            {/* <PrinterCheck /> */}
            <Printer />
          </Button>
          {/* Print Invoice */}
          <div className="hidden">
            {orderData && (
              <PrintInvoice ref={printerRef} orderData={orderData} />
            )}
          </div>
        </div>
      );
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      const [deleting, setDeleting] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
      const { _id } = row.original;

      const handleDeleteClick = async () => {
        if (await confirmation("Are you sure you want to delete this order?")) {
          setDeleting(true);
          try {
            const deleted = await deleteOrderAction(String(_id));
            if (deleted) {
              toast({
                title: "Order deleted successfully",
                variant: "default",

              });
              window.location.reload();
            }
          } catch (error: any) {
            toast({
              title: "Cannot delete order",
              description: error.message,
              variant: "destructive",
            });
          } finally {
            setDeleting(false);
          }
        }
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
  }


];
function fetchOrders() {
  throw new Error("Function not implemented.");
}

