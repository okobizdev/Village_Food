
"use client";

import { prefetchRoute } from "@/lib/prefetch";
import { useEffect } from "react";


export default function RoutePrefetcher() {
    useEffect(() => {
        // Critical routes
        prefetchRoute(
            () => import("@/app/(admin-panel)/dashboard/page"),
            "dashboard"
        );

        prefetchRoute(
            () => import("@/app/(admin-panel)/banners/page"),
            "banners"
        );

        prefetchRoute(
            () => import("@/app/(admin-panel)/order-list/page"),
            "order-list"
        );

        prefetchRoute(
            () => import("@/app/(admin-panel)/products/page"),
            "products"
        );

    }, []);

    return null;
}
