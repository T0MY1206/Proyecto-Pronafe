// TableBody.tsx
import { useState } from "react";
import TableDataColumn from "./TableDataColumn";
import TableActionColumn from "./TableActionColumn";
import TableDataEmpty from "./TableDataEmpty";
import React from "react";

interface TableBodyProps {
    head: TableHeadOption[];
    data: any[];
    actions?: TableAction[];
    expandable?: boolean;
    onRowClick?: (row: any) => void;
    expandedRowComponent?: React.ComponentType<any>;
}

export default function TableBody({
    head,
    data,
    actions,
    expandable = false,
    expandedRowComponent: ExpandedComponent,
    onRowClick
}: TableBodyProps) {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const handleRowClick = async (row: any) => {
        if (!expandable) return;

        // Ejecutar el callback de la página principal
        if (onRowClick) {
            await onRowClick(row);
        }

        const rowId = (row as { id: number }).id;
        if (expandedRowId === rowId) {
            setExpandedRowId(null);
        } else {
            setExpandedRowId(rowId);
        }
    };

    if (data.length === 0) {
        return <TableDataEmpty head={head} />;
    }

    return (
        <tbody>
            {data.map((row, index) => (
                <React.Fragment key={row.id ?? index}>
                    {/* Fila principal */}
                    <tr
                        className={expandable ? "cursor-pointer hover:bg-gray-100" : ""}
                        onClick={() => handleRowClick(row)}
                    >
                        <TableDataColumn data={row} head={head} />

                        {actions && actions.length > 0 && (
                            <TableActionColumn actions={actions} data={row} />
                        )}
                    </tr>
                    {/* Fila expandida */}
                    {expandable && expandedRowId === row.id && ExpandedComponent && (
                        <tr key={`expanded-${row.id}`}>
                            <td colSpan={head.length + (actions?.length ? 1 : 0)}>

                                <ExpandedComponent {...row} />
                            </td>
                        </tr>
                    )}
                </React.Fragment>
            ))}
        </tbody>
    );
}


