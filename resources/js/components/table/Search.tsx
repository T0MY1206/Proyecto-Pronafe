import { useState, useEffect, useRef } from 'react';
import AppIcon from "../Icons/AppIcon";

interface SearchProps {
    initialSearchTerm: string;
    onSearch: (searchTerm: string) => void;
}

export default function Search({ initialSearchTerm, onSearch }: SearchProps) {
    const [term, setTerm] = useState(initialSearchTerm ?? '');
    const onSearchRef = useRef(onSearch);
    onSearchRef.current = onSearch;

    useEffect(() => {
        const t = term.trim();

        if (t.length < 3) {
            if (t === '' && initialSearchTerm === '') {
                return;
            }
        }

        const timeout = setTimeout(() => {
            onSearchRef.current(t);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [term, initialSearchTerm]);

    const deleteSearch = () => setTerm('');

    return (
        <div className='flex items-center'>
            <div className="w-full sm:w-auto mt-3 sm:mt-0 sm:ml-auto md:ml-0 flex items-center gap-2">
                <div className="w-56 relative text-gray-900 dark:text-gray-300">
                    <input
                        type="text"
                        className="form-control w-56 box pr-10 placeholder-theme-13"
                        placeholder="Buscar ..."
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    <AppIcon name="search" className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" />
                </div>
                <a href="#" onClick={deleteSearch}>
                    <AppIcon
                        name="delete"
                        className="cursor-pointer m-2 w-8 h-7 text-gray-900 bg-blue-950/10 rounded-lg px-1 py-1 shadow-lg transition-all duration-150 hover:bg-blue-950/97 ring-2 hover:ring-blue-400 hover:text-white active:bg-blue-900 active:text-white"
                    />
                </a>
            </div>
        </div>
    );
}
