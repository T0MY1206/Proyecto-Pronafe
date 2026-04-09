import type { PaginatorOptions } from '@/types/paginate';

export default function PaginatorData({ data }: { data: PaginatorOptions }) {
    const total = data.total ?? 0;

    if (total === 0) {
        return (
            <div className="mx-auto hidden text-sm text-slate-600 md:block">No hay registros</div>
        );
    }

    const from = data.from ?? 0;
    const to = data.to ?? 0;

    return (
        <div className="mx-auto hidden text-sm text-slate-600 md:block">
            Mostrando {from} a {to} de {total} registros
        </div>
    );
}
