import { hasParentClass } from '@/lib/functions';
import { useCallback, useEffect, useState } from 'react';

interface UseContextMenuParams {
    show: boolean;
    setShow: (show: boolean) => void;
    menuWidth: number;
    /** Legado: posición desde la derecha del viewport (sin ancla). */
    padding?: number;
    top?: number;
    classes?: string[];
    /** Si se define, el menú usa position:fixed bajo el elemento disparador. */
    anchorSelector?: string;
}

export function useContextMenu({
    show,
    setShow,
    menuWidth,
    padding = 58,
    top = 71,
    classes = [],
    anchorSelector,
}: UseContextMenuParams) {
    const [style, setStyle] = useState<React.CSSProperties>({});
    const [width, setWidth] = useState(
        typeof document !== 'undefined' ? document.body.clientWidth : 0,
    );

    useEffect(() => {
        const handleResize = () => {
            setWidth(typeof document !== 'undefined' ? document.body.clientWidth : 0);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!show) {
            setStyle({});
            return;
        }

        if (anchorSelector) {
            const updateAnchor = () => {
                const anchor = document.querySelector(anchorSelector) as HTMLElement | null;
                if (!anchor) {
                    return;
                }
                const rect = anchor.getBoundingClientRect();
                const margin = 8;
                let left = rect.right - menuWidth;
                left = Math.min(window.innerWidth - menuWidth - margin, Math.max(margin, left));
                const menuTop = rect.bottom + margin;
                setStyle({
                    position: 'fixed',
                    left: `${left}px`,
                    top: `${menuTop}px`,
                    width: `${menuWidth}px`,
                    margin: '0',
                    transform: 'none',
                    inset: 'unset',
                    zIndex: 50,
                    visibility: 'visible',
                    pointerEvents: 'auto',
                });
            };

            updateAnchor();
            window.addEventListener('resize', updateAnchor);
            window.addEventListener('scroll', updateAnchor, true);
            return () => {
                window.removeEventListener('resize', updateAnchor);
                window.removeEventListener('scroll', updateAnchor, true);
            };
        }

        setStyle((prev) => ({
            ...prev,
            width: `${menuWidth}px`,
            position: 'absolute',
            inset: '0px auto auto 0px',
            margin: '0px',
            transform: `translate(${width - menuWidth - padding}px, ${top}px)`,
            zIndex: 50,
            visibility: 'visible',
            pointerEvents: 'auto',
        }));
    }, [show, menuWidth, padding, top, width, anchorSelector]);

    const onDocumentClick = useCallback(
        (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!hasParentClass(classes, target)) {
                setShow(false);
            }
        },
        [classes, setShow],
    );

    useEffect(() => {
        if (!show) return;

        document.addEventListener('click', onDocumentClick);
        return () => {
            document.removeEventListener('click', onDocumentClick);
        };
    }, [show, onDocumentClick]);

    return { style };
}
