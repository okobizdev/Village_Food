"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/config/config";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: null, label: "None", color: "gray" },
  { value: "bestSeller", label: "Best Seller", color: "blue" },
  { value: "bestDeal", label: "Best Deal", color: "green" },
  { value: "popular", label: "Popular", color: "purple" },
];

const COLOR_CLASSES: any = {
  gray: "bg-gray-100 text-gray-700 border-gray-300",
  blue: "bg-blue-100 text-blue-700 border-blue-300",
  green: "bg-green-100 text-green-700 border-green-300",
  purple: "bg-purple-100 text-purple-700 border-purple-300",
};

const getStatusInfo = (status: string | null) => {
  return (
    STATUS_OPTIONS.find((opt) => opt.value === status) || STATUS_OPTIONS[0]
  );
};

interface ProductStatusDropdownProps {
  productId: string;
  currentStatus: string | null;
}

export const ProductStatusDropdown: React.FC<ProductStatusDropdownProps> = ({
  productId,
  currentStatus,
}) => {
  const [status, setStatus] = useState<string | null>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    const statusValue = newStatus === "null" ? "null" : newStatus;
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/product/status/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusValue }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setStatus(statusValue);
      toast.success("Product status updated successfully!");
    } catch (error) {
      toast.error("Failed to update product status");
    } finally {
      setIsLoading(false);
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status || "null"}
        onValueChange={handleStatusChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue>
            <Badge
              variant="outline"
              className={`rounded-md py-2 px-4 ${
                COLOR_CLASSES[statusInfo.color]
              }`}
            >
              {isLoading ? "Updating..." : statusInfo.label}
            </Badge>
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem
              key={option.value || "null"}
              value={option.value || "null"}
            >
              <Badge
                variant="outline"
                className={`rounded-md py-2 px-4 ${
                  COLOR_CLASSES[option.color]
                }`}
              >
                {option.label}
              </Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
