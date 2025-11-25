import type { ReactNode } from "react";

export {};

declare global {

    interface PaginatorLink {
        label: string,
        url: string,
        active: boolean
    }

    interface PaginatorOptions {
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
        data?: TableRow[],
        order?: string,
        direction?: string,
        [string]: any
    }

    interface PaginationProp {
        options: {
            search: string,
            order: string,
            direction: string
            limit: number
        }
    }

    interface PaginatorData {
        data: Paginator
    }

    interface TableHeadOption {
      className?: ColumnAction<string>;
      label: string;
      value: string;
      icon?: ColumnAction<IconName>;
      iconClass?: string;
      render?: (data: any) => ReactNode;
    }

    interface TableAction {
      icon: IconName;
      label?: string;
      className?: ColumnAction<string>;
      iconClass?: string;
      condition?: ConditionAction;
      action: (data: any) => void;
    }

    type ConditionAction = boolean | ((data: any) => boolean);
    type ColumnAction<T extends string = string> = T | ((data: any) => T);
}
