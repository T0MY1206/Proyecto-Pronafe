
export interface TargetData {
    title: string,
    totalValue: number
}

export default function Target( { title, totalValue }: TargetData) {
    //  agregar lógica adicional si es necesario
    return (
        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-x w-full">
            <div className="box p-5 zoom-in h-full">
                    <div className="w-fit d-flex ">
                        <div className="text-lg font-medium ">{title}</div>
                        <div className="text-gray-600 mt-1 font-bold">{totalValue}</div>
                    </div>
            </div>
        </div>
    );
}
