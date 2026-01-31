
import { useEffect } from "react";
import { prefetchRoute } from "@/lib/prefetch";

export default function RoutePrefetcher() {
    useEffect(() => {
        // Critical routes
        prefetchRoute(
            () => import("@/pages/Dashboard"),
            "dashboard"
        );

        prefetchRoute(
            () => import("@/pages/Users"),
            "users"
        );

        prefetchRoute(
            () => import("@/pages/Settings"),
            "settings"
        );
    }, []);

    return null;
}
