import { Link } from "@inertiajs/react";
import AppIcon, { IconName } from "../Icons/AppIcon";

interface AppMenuUserItemProps {
    title: string;
    icon: IconName; 
    url: string;
}

export default function AppMenuUserItem({ title, icon, url }: AppMenuUserItemProps) {
    return <Link href={ route(url) }
              className="flex items-center rounded-lg p-2 text-slate-800 transition-colors duration-200 ease-out hover:bg-slate-300/60">
        <AppIcon name={ icon } className="w-4 h-4 mr-2"></AppIcon> { title }
    </Link>;
}