interface AppMenuSearchProps {
    show: boolean;
}

export function AppMenuSearch({show}: AppMenuSearchProps) {
    return <div className={`search-result ${ show === true ? 'show' : '' }`}>
        <div className="search-result__content">
            <div className="search-result__content__title">Pages</div>
            <div className="mb-5">
                <a href="" className="flex items-center">
                    <div className="w-8 h-8 bg-theme-17 text-theme-20 flex items-center justify-center rounded-full"> <i className="w-4 h-4" data-feather="inbox"></i> </div>
                    <div className="ml-3">Mail Settings</div>
                </a>
                <a href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 bg-theme-18 text-theme-21 flex items-center justify-center rounded-full"> <i className="w-4 h-4" data-feather="users"></i> </div>
                    <div className="ml-3">Users & Permissions</div>
                </a>
                <a href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 bg-theme-19 text-theme-22 flex items-center justify-center rounded-full"> <i className="w-4 h-4" data-feather="credit-card"></i> </div>
                    <div className="ml-3">Transactions Report</div>
                </a>
            </div>
            <div className="search-result__content__title">Users</div>
            <div className="mb-5">
                <a href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                        <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                    </div>
                    <div className="ml-3">Kevin Spacey</div>
                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">kevinspacey@left4code.com</div>
                </a>
                <a href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                        <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                    </div>
                    <div className="ml-3">Johnny Depp</div>
                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">johnnydepp@left4code.com</div>
                </a>
                <a href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                        <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                    </div>
                    <div className="ml-3">Johnny Depp</div>
                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">johnnydepp@left4code.com</div>
                </a>
                <a href="" className="flex items-center mt-2">
                    <div className="w-8 h-8 image-fit">
                        <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                    </div>
                    <div className="ml-3">Tom Cruise</div>
                    <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">tomcruise@left4code.com</div>
                </a>
            </div>
            <div className="search-result__content__title">Products</div>
            <a href="" className="flex items-center mt-2">
                <div className="w-8 h-8 image-fit">
                    <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                </div>
                <div className="ml-3">Sony A7 III</div>
                <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">Photography</div>
            </a>
            <a href="" className="flex items-center mt-2">
                <div className="w-8 h-8 image-fit">
                    <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                </div>
                <div className="ml-3">Sony A7 III</div>
                <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">Photography</div>
            </a>
            <a href="" className="flex items-center mt-2">
                <div className="w-8 h-8 image-fit">
                    <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                </div>
                <div className="ml-3">Sony A7 III</div>
                <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">Photography</div>
            </a>
            <a href="" className="flex items-center mt-2">
                <div className="w-8 h-8 image-fit">
                    <img alt="Tinker Tailwind HTML Admin Template" className="rounded-full" src="/storage/images/default.jpg" />
                </div>
                <div className="ml-3">Sony Master Series A9G</div>
                <div className="ml-auto w-48 truncate text-gray-600 text-xs text-right">Electronic</div>
            </a>
        </div>
    </div>;
}
