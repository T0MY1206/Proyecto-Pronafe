import { ReactNode } from "react";
import AppIcon, { IconName } from "../Icons/AppIcon";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null;
}

/** Obtiene un valor anidado por path "a.b.c"
 *  - Si hay un `head.render`, devuelve su ReactNode
 *  - Si no hay render, normaliza el valor a algo renderizable (ReactNode)
 */
function getData(head: TableHeadOption, item: any): ReactNode {
  const segments = head.value.split(".");
  let current: any | undefined | unknown= item;

  for (let i = 0; i < segments.length; i++) {
    const key = segments[i];
    if (!isRecord(current)) {
      current = undefined;
      break;
    }
    current = current[key];
  }

  // Si hay render externo, lo usamos
  if (head?.render) {
    return head.render(current);
  }

  // Sin render: convertimos a algo seguro de renderizar
  // Permitimos primitives y null/undefined => string vacío
  if (
    current == null || // null | undefined
    typeof current === "number" ||
    typeof current === "string" ||
    typeof current === "boolean"
  ) {
    return current ?? "";
  }

  // Si llega un objeto/array/función, lo mostramos como string
  try {
    return JSON.stringify(current);
  } catch {
    return String(current);
  }
}

/** Normaliza ColumnAction<T> a T */
function getColumn<T extends string>(
  column: ColumnAction<T> | undefined,
  data: any
): T | "" {
  if (typeof column === "function") {
    return column(data);
  }
  return column ?? "";
}

export default function TableDataColumn({
  data,
  head,
}: {
  data: any;
  head: TableHeadOption[];
}) {
  return head.map((y) => (
    <td key={y.value}>
      <div className={getColumn(y.className, data)}>
        {y.icon && (
          <AppIcon
            name={getColumn<IconName>(y.icon, data) as IconName}
            className={y.iconClass}
          />
        )}
        {getData(y, data)}
      </div>
    </td>
  ));
}
