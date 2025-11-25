import {Link} from "@inertiajs/react";
import {getUrlPaginate} from "@/lib/functions";

interface TableHeadProps {
    head: TableHeadOption[];
    options: PaginatorOptions;
    hasAction: boolean;
}

export default function ({ head, options = {}, hasAction }: TableHeadProps) {
    const { path, per_page } = options;

    // obtener orden y dirección actuales (fallback a query string si no vienen en options)
    const getCurrentOrder = () => {
        if (options?.order) return options.order;
        if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get('order') ?? '';
        return '';
    };
    const getCurrentDirection = () => {
        if (options?.direction) return options.direction;
        if (typeof window !== "undefined") return new URLSearchParams(window.location.search).get('direction') ?? 'asc';
        return 'asc';
    };

    const currentOrder = getCurrentOrder();
    const currentDirection = getCurrentDirection();

    const buildUrl = (colValue: string) => {
        // togglear dirección si se clickea la misma columna
        const nextDirection = currentOrder === colValue ? (currentDirection === 'asc' ? 'desc' : 'asc') : 'asc';

        // base path (fallback a la ruta actual si no se pasó)
        const basePath = path ?? (typeof window !== "undefined" ? window.location.pathname : '/');

        const url = new URL(basePath, typeof window !== "undefined" ? window.location.origin : 'http://localhost');
        const params = new URLSearchParams(url.search);

        // copiar options al query (excepto path)
        Object.keys(options || {}).forEach((k) => {
            if (k === 'path') return;
            const v = (options as any)[k];
            if (v === undefined || v === null) return;
            params.set(k, String(v));
        });

        params.set('order', colValue);
        params.set('direction', nextDirection);
        if (per_page) params.set('limit', String(per_page));
        // resetear página al cambiar orden
        params.set('page', '1');

        return `${url.pathname}?${params.toString()}`;
    };

    const headHtml = head.map((x, i) => (
        <th className={`${x.className ?? ""} whitespace-nowrap`} key={i}>
        <Link
            href={buildUrl(x.value)}
            className="flex items-center gap-1 w-fit"
        >
            {x.label}
            {currentOrder === x.value && (
            <span className="ml-1 text-xs">
                {currentDirection === "desc" ? "▼" : "▲"}
            </span>
            )}
        </Link>
        </th>
    ));


    return (
        <thead>
            <tr>
                {headHtml}
                {hasAction && <th className={`whitespace-nowrap`}>Acción</th>}
            </tr>
        </thead>
    );
}
