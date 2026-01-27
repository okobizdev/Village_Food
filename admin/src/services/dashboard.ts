"use server";

import { BASE_URL } from "@/config/config";
import { DashboardMetricsResponse } from "@/types/shared";

export async function getDashboardMetrics(
  duration: string = "this-month"
): Promise<DashboardMetricsResponse> {
  const response = await fetch(
    `${BASE_URL}/report/dashboard-metrics?duration=${duration}`
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}
