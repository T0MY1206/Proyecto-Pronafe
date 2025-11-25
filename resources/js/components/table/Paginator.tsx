import AppIcon from "../Icons/AppIcon";
import PaginatorCount from "@/components/table/PaginatorCount";

interface PaginatorProps {
    paginator: PaginatorOptions;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

export default function Paginator({ paginator, onPageChange, onPerPageChange }: PaginatorProps) {
    // Manejador para el cambio de página. Llama a la función del componente padre.
    const handlePageClick = (page: number | null) => {
        if (!page) return;
        onPageChange?.(page);
    };

    // Manejador para el cambio de cantidad de items por página.
    // Llama a la función del componente padre y resetea la página a 1.
    const handlePerPageChange = (newPerPage: number) => {
        onPerPageChange?.(newPerPage);
        onPageChange?.(1); // Importante: volver a la primera página al cambiar el per_page
    };

    // Helper para extraer el número de página de una URL.
    const getPageFromUrl = (url: string | null): number | null => {
        if (!url) return null;
        const match = url.match(/page=(\d+)/);
        return match ? parseInt(match[1]) : null;
    };

    return (
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center">
            <ul className="pagination">
                <li>
                    <button
                        onClick={() => handlePageClick(1)}
                        disabled={!paginator.first_page_url}
                        className="pagination__link disabled:opacity-50"
                    >
                        <AppIcon name="chevrons-left" className="w-4 h-4" />
                    </button>
                </li>
                {paginator.links?.map((link, index) => {
                    const page = getPageFromUrl(link.url);
                    return (
                        <li key={index}>
                            <button
                                onClick={() => handlePageClick(page)}
                                disabled={!link.url || link.active}
                                className={`pagination__link ${link.active ? 'pagination__link--active' : ''} disabled:opacity-50`}
                            >
                                {link.label === '&laquo; Previous' ? (
                                    <AppIcon name="chevron-left" className="w-4 h-4" />
                                ) : link.label === 'Next &raquo;' ? (
                                    <AppIcon name="chevron-right" className="w-4 h-4" />
                                ) : (
                                    link.label
                                )}
                            </button>
                        </li>
                    );
                })}
                <li>
                    <button
                        onClick={() => handlePageClick(paginator.last_page ? paginator.last_page : null)}
                        disabled={!paginator.last_page_url}
                        className="pagination__link disabled:opacity-50"
                    >
                        <AppIcon name="chevrons-right" className="w-4 h-4" />
                    </button>
                </li>
            </ul>

            {/* PaginatorCount ahora usa la función `handlePerPageChange` de Paginator */}
            <PaginatorCount
                per_page={paginator.per_page ?? 10}
                onPerPageChange={handlePerPageChange}
            />
        </div>
    );
}
