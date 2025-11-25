// lib/useFilters.ts
import { router } from "@inertiajs/react";
import { getUrlPaginate } from "@/lib/functions";

export function applyFilters(
    baseUrl: string,
    currentFilters: Record<string, any>,
    newFilters: Record<string, any>
) {
    // Construye la URL inicial con los filtros actuales
    let newUrl = getUrlPaginate(
        baseUrl,
        currentFilters,
        currentFilters.limit ?? 10,
        currentFilters.order ?? null
    );

    // Parseamos los query params
    const urlObj = new URLSearchParams(newUrl.split("?")[1] ?? "");

    // Mezclamos con los filtros nuevos
    Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            urlObj.set(key, String(value));
        } else {
            urlObj.delete(key);
        }
    });

    router.visit(`${baseUrl}?${urlObj.toString()}`, {
        preserveState: true,
        replace: true,
    });
}
