interface PaginatorCountProps {
    per_page: number;
    onPerPageChange: (newPerPage: number) => void;
}

export default function PaginatorCount({ per_page, onPerPageChange }: PaginatorCountProps) {  
    return (
        <select
            className="w-20 form-select box mt-3 sm:mt-0"
            value={per_page}
            onChange={e => onPerPageChange(Number(e.target.value))}
        >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
        </select>
    );
}
