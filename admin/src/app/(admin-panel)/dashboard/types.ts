
export interface DashboardMetrics {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
}

export interface DashboardMetricsResponse {
    statusCode: number;
    status: string;
    message: string;
    data: DashboardMetrics;
}