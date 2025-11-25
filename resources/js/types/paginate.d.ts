export interface PaginatorLink {
    label: string,
    url: string,
    active: boolean
}

export interface PaginatorOptions {
    first_page?: number | null,
    last_page?:  number | null,
    first_page_url?: string,
    last_page_url?: string,
    per_page?: number,
    path?: string
    links?: PaginatorLink[]
    from?: number,
    to?: number,
    total?: number,
    data?: unknown[],
    order: string,
    direction: string
}

export interface PaginationProp {
    search: string,
    order: string,
    direction: string
}

export interface PaginatorData {
    data: Paginator
}

export interface TableHeadOption {
    className?: ColumnAction,
    label: string,
    value: string,
    icon?: ColumnAction,
    iconClass?: string,
    render?: (data: unknown) => unknown
}

export interface TableAction {
    icon: IconName,
    label?: unknown,
    className?: ColumnAction,
    iconClass?: string,
    condition?: ConditionAction,
    action: (data: unknown) => void
}

export type ConditionAction = (data: unknown) => boolean | boolean;
export type Co1lumnAction = (name: string) => string | string;
