"use client";
import { deleteCartProduct } from "@/services/cart";
import { useRouter } from "next/navigation";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useState } from "react";

const CartDelete = ({ cardId }: { cardId: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCartProduct(cardId);
      router.refresh();
      toast.success("Deleted cart");
    } catch (err) {
      console.error("Failed to  delete cart", err);
      toast.error("Failed to  delete cart.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RiDeleteBin6Line className="bg-[#C9302C]  h-7 w-7 p-1" />
      </button>
    </div>
  );
};

export default CartDelete;
