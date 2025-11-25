export default function TableDataEmpty({head}: {head: TableHeadOption[]}) {
    return <tbody>
        <tr>
            <td colSpan={head.length + 1} className="text-center">No hay registros</td>
        </tr>
    </tbody>
}
