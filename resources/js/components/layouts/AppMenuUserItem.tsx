import { Link } from "@inertiajs/react";
import AppIcon, { IconName } from "../Icons/AppIcon";

interface AppMenuUserItemProps {
    title: string;
    icon: IconName; 
    url: string;
}

export default function ({ title, icon, url }: AppMenuUserItemProps) {
    return <Link href={ route(url) }
              className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-3 rounded-md">
        <AppIcon name={ icon } className="w-4 h-4 mr-2"></AppIcon> { title }
    </Link>;
}