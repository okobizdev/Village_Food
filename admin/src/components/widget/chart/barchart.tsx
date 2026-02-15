"use client";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getDashboardMetrics } from "@/app/(admin-panel)/dashboard/service";
import { ShoppingBag } from "lucide-react";

interface BarChartProps {
  selectChartDuration: string;
}

const BarChart: React.FC<BarChartProps> = ({ selectChartDuration }) => {
  const [data, setData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await getDashboardMetrics(selectChartDuration);
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [selectChartDuration]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px] bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border m-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  const series = [
    {
      name: "Orders",
      data: [
        data.totalOrders,
        data.pendingOrders,
        data.deliveredOrders,
        data.cancelledOrders,
      ],
    },
  ];

  const categories = ["Total", "Pending", "Delivered", "Cancelled"];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: "50%",
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -25,
      style: {
        fontSize: "14px",
        fontWeight: 700,
        colors: ["#1f2937"],
      },
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 6,
        borderRadius: 6,
        borderWidth: 0,
        opacity: 0.9,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "14px",
          fontWeight: 600,
          colors: ["#05a845", "#FBBF24", "#10B981", "#EF4444"],
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "13px",
          colors: "#6b7280",
        },
        formatter: (val: number) => Math.floor(val).toString(),
      },
    },
    colors: ["#05a845", "#FBBF24", "#10B981", "#EF4444"],
    tooltip: {
      enabled: true,
      theme: "light",
      y: {
        formatter: (val: number) => `${val} Orders`,
      },
      style: {
        fontSize: "13px",
      },
      marker: {
        show: true,
      },
    },
    legend: { show: false },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 3,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: 0,
        right: 25,
        bottom: 10,
        left: 15,
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
    },
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow-sm border m-4 p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Orders Overview</h3>
          <p className="text-sm text-gray-500 mt-1">Order status distribution</p>
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
        <Chart options={options} series={series} type="bar" height={320} />
      </div>

    </div>
  );
};

export default BarChart;