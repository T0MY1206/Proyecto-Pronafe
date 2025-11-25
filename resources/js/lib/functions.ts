import { PaginationProp } from '@/types/paginate';

export function hasParentClass(classNames: string[], parent: HTMLElement) {
    if (typeof classNames === 'string') {
        if (parent.classList.contains(classNames)) return true;
    } else {
        for (let i = 0; i < classNames.length; i++) {
            if (parent.classList.contains(classNames[i])) return true;
        }
    }

    if (parent.parentElement) {
        return hasParentClass(classNames, parent.parentElement);
    }

    return false;
}

export function getUrlPaginate(
    url: string, 
    options: Record<string, any>, 
    limit: number, 
    columnOrder: string | null = null
    ) {
    if (!url) return '';

    const params: Record<string, string> = {};

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params[key] = value.toString();
        }
    });

    if (limit) params.limit = limit.toString();

    if (columnOrder) {
        params.direction =
            options.order === columnOrder
                ? (options.direction === 'desc' ? 'asc' : 'desc')
                : 'asc';
    }

    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

    return url + (url.includes('?') ? '&' : '?') + queryString;
}

export function checkCurrent(routes: string[] = []) {
    const currentRoute = route().current() as string;

    const find = routes.find((value) => currentRoute.includes(value));

    return !!find;
}
