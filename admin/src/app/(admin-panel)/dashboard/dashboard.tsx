"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SelectDuration from "@/components/selectDuration/SelectDuration";
import BarChart from "@/components/widget/chart/barchart";
import { getDashboardMetrics } from "./service";

interface DashboardCounts {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}


export default function AdminDashboard() {
  const [selectRadialsChart, setSelectRadialsChart] = useState("this-month");
  const [selectChartLabel, setSelectChartLabel] = useState("This Month");
  const [counts, setCounts] = useState<DashboardCounts>({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const router = useRouter();

  useEffect(() => {
    getDashboardMetrics(selectRadialsChart).then((data) => {
      setCounts({
        totalOrders: data.data.totalOrders ?? 0,
        pendingOrders: data.data.pendingOrders ?? 0,
        deliveredOrders: data.data.deliveredOrders ?? 0,
        cancelledOrders: data.data.cancelledOrders ?? 0,
      });
    });
  }, [selectRadialsChart]);

  return (
    <div>
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-gray-600">
            {selectChartLabel}
          </Label>
          <div className="">
            <SelectDuration
              setSelectChartFilter={setSelectRadialsChart}
              setSelectChartFilterLabel={setSelectChartLabel}
            />
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <Card className="group hover:bg-primary hover:text-white">
            <div className="flex items-center justify-start pl-6 h-36">
              <div className="rounded-sm h-8 w-8 flex justify-center items-center">
                <ShoppingBag size={20} />
              </div>
              <CardHeader>
                <CardDescription className="group-hover:text-white">
                  Total Orders
                </CardDescription>
                <CardTitle>{counts.totalOrders}</CardTitle>
              </CardHeader>
            </div>
          </Card>

          {/* Pending Orders */}
          <Card className="group hover:bg-yellow-500 hover:text-white">
            <div className="flex items-center justify-start pl-6 h-36">
              <div className="rounded-sm h-8 w-8 flex justify-center items-center">
                <Clock size={20} />
              </div>
              <CardHeader>
                <CardDescription className="group-hover:text-white">
                  Pending Orders
                </CardDescription>
                <CardTitle>{counts.pendingOrders}</CardTitle>
              </CardHeader>
            </div>
          </Card>

          {/* Delivered Orders */}
          <Card className="group hover:bg-green-500 hover:text-white">
            <div className="flex items-center justify-start pl-6 h-36">
              <div className="rounded-sm h-8 w-8 flex justify-center items-center">
                <CheckCircle size={20} />
              </div>
              <CardHeader>
                <CardDescription className="group-hover:text-white">
                  Delivered Orders
                </CardDescription>
                <CardTitle>{counts.deliveredOrders}</CardTitle>
              </CardHeader>
            </div>
          </Card>

          {/* Cancelled Orders */}
          <Card className="group hover:bg-red-500 hover:text-white">
            <div className="flex items-center justify-start pl-6 h-36">
              <div className="rounded-sm h-8 w-8 flex justify-center items-center">
                <XCircle size={20} />
              </div>
              <CardHeader>
                <CardDescription className="group-hover:text-white">
                  Cancelled Orders
                </CardDescription>
                <CardTitle>{counts.cancelledOrders}</CardTitle>
              </CardHeader>
            </div>
          </Card>
        </div>

        <div>
          <BarChart selectChartDuration={selectRadialsChart} />
        </div>
      </div>
    </div>
  );
}