import { hasParentClass } from "@/lib/functions";
import { useCallback, useEffect, useState } from "react";

interface UseContextMenuParams {
  show: boolean;
  setShow: (show: boolean) => void;
  menuWidth: number;
  padding: number;
  top: number;
  classes?: string[];
}

export function useContextMenu({
  show,
  setShow,
  menuWidth,
  padding,
  top,
  classes = [],
}: UseContextMenuParams) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [width, setWidth] = useState(
    typeof document !== "undefined" ? document.body.clientWidth : 0
  );

  // 1) Solo escucha el resize y actualiza width
  useEffect(() => {
    const handleResize = () => {
      const value =
        typeof document !== "undefined" ? document.body.clientWidth : 0;
      setWidth(value);
    };

    window.addEventListener("resize", handleResize);
    // llamar una vez para setear el valor inicial si hace falta
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 2) Recalcula el style cuando cambian show/menuWidth/padding/top/width
  useEffect(() => {
    if (show) {
      setStyle((prev) => ({
        ...prev,
        width: `${menuWidth}px`,
        position: "absolute",
        inset: "0px auto auto 0px",
        margin: "0px",
        transform: `translate(${width - menuWidth - padding}px, ${top}px)`,
      }));
    } else {
      // opcional: limpiar estilo al cerrar
      setStyle((prev) => ({ ...prev }));
    }
  }, [show, menuWidth, padding, top, width]);

  // 3) Handler de click memoizado
  const onDocumentClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!hasParentClass(classes, target)) {
        setShow(false);
      }
    },
    [classes, setShow]
  );

  // 4) Alta/baja del listener de click cuando show cambia
  useEffect(() => {
    if (!show) return;

    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [show, onDocumentClick]);

  return { style };
}
