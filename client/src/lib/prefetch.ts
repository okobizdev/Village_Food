
const prefetchedRoutes = new Set<string>();

export function prefetchRoute(importFn: () => Promise<any>, key: string) {

    if (prefetchedRoutes.has(key)) return;

    prefetchedRoutes.add(key);

    // Idle time এ preload করবে
    if ("requestIdleCallback" in window) {
        requestIdleCallback(() => importFn());
    } else {
        setTimeout(() => importFn(), 200);
    }
    
}
