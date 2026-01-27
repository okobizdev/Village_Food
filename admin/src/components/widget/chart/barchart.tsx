"use client";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { OrderReport } from "@/types/shared";
import { getOrderReportsByDuration } from "@/services/reports";

interface BarChartProps {
  selectChartDuration: string;
}

const BarChart: React.FC<BarChartProps> = ({ selectChartDuration }:BarChartProps) => {
  const [data, setData] = useState<OrderReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await getOrderReportsByDuration({ duration: selectChartDuration });
        setData(
          (response?.data as unknown as OrderReport[]).map((item) => ({
            status: item.status || "Unknown",
            totalOrders: item.totalOrders || 0,
            totalSubTotalPrice: item.totalSubTotalPrice || 0,
            totalProducts: item.totalProducts || 0,
          })) || []
        );
      } catch (error) {
        console.error("Failed to fetch order report:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectChartDuration]);

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  const series = [
    {
      name: "Total Orders",
      data: data.map((item) => item.totalOrders),
    },
  ];
  const categories = data.map((item) => item.status);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "40%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "14px",
        },
      },
      title: {
        text: "Order Status",
        style: { fontWeight: 600 },
      },
    },
    yaxis: {
      title: {
        text: "Total Orders",
        style: { fontWeight: 600 },
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    colors: ["#4669FA", "#FA916B", "#50C793", "#0CE7FA"],
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val} orders`,
      },
      custom: function({ series, seriesIndex, dataPointIndex }) {
        const item = data[dataPointIndex];
        if (!item) return "";
        return `
          <div style="padding: 10px; font-size: 14px;">
            <strong>Status:</strong> ${item.status} <br/>
            <strong>Total Orders:</strong> ${item.totalOrders} <br/>
            <strong>Total Products:</strong> ${item.totalProducts} <br/>
            <strong>Total SubTotal Price:</strong> $${item.totalSubTotalPrice.toFixed(2)} <br/>
          </div>
        `;
      },
    },
    legend: { show: false },
  };

  return (
    <div className="py-[30px]">
      <Chart options={options} series={series} type="bar" height={340} />
    </div>
  );
};

export default BarChart;