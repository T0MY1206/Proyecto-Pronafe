export interface TargetData {
    title: string;
    totalValue: number;
}

export default function Target({ title, totalValue }: TargetData) {
    return (
        <div className="intro-x min-w-0 flex-1">
            <div className="zoom-in flex h-full min-h-[5.5rem] flex-col justify-center rounded-xl border border-slate-400/45 bg-slate-200/90 px-4 py-3 shadow-md shadow-slate-600/10 transition-shadow duration-200 hover:shadow-lg">
                <div className="text-sm font-medium text-slate-600">{title}</div>
                <div className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900">
                    {totalValue}
                </div>
            </div>
        </div>
    );
}
