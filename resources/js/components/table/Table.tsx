import Paginator from "./Paginator";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import PaginatorData from "@/components/table/PaginatorData";
import { ReactNode } from "react";

interface TableProps {
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    onRowClick?: (row: any) => void;
    paginator?: PaginatorOptions;
    children?: ReactNode;
    head: TableHeadOption[];
    rows: any[] | PaginatorOptions;
    actions?: TableAction[];
    paginate?: boolean;
    expandable?: boolean;
    expandedRowComponent?: React.ComponentType<any>;
    options?: any;
}

export default function Table({
    paginator,
    children,
    head,
    rows,
    actions,
    paginate,
    expandable = false,
    expandedRowComponent,
    onRowClick,
    onPerPageChange,
    onPageChange,
    options
}: TableProps) {
    const rowsData = paginate && typeof rows === "object" && rows !== null && "data" in rows
        ? (rows as PaginatorOptions).data
        : rows;

    return (
        <>
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    {paginate && <PaginatorData data={rows} />}
                    {children}
                </div>

                <div className="intro-y col-span-12 max-w-full">
                    <div className="max-w-full overflow-x-auto overscroll-x-contain">
                    <table className="table table-report">
                        <TableHead head={head} options={options ?? rows} hasAction={(actions?.length ?? 0) > 0} />
                        <TableBody
                            head={head}
                            data={Array.isArray(rowsData) ? rowsData : []}
                            actions={actions}
                            expandable={expandable}
                            onRowClick={onRowClick}
                            expandedRowComponent={expandedRowComponent}
                        />
                    </table>
                    </div>
                </div>
            </div>

            {paginate && paginator && (
                <Paginator paginator={paginator} onPageChange={onPageChange} onPerPageChange={onPerPageChange} />
            )}
        </>
    );
}
