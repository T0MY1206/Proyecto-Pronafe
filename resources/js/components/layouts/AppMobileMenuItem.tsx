import { Link } from "@inertiajs/react";
import { ReactNode, useState } from "react";
import AppIcon, { type IconName } from "../Icons/AppIcon";

interface AppMobileMenuItemProps {
    title: string;
    url: string;
    icon: IconName;
    active?: boolean;
    children?: ReactNode;
}

export default function ({title, url, icon, active, children}: AppMobileMenuItemProps) {
    const [open, setOpen] = useState(active ?? false);

    const onClick = function (event: any) {
        if(children) {
            event.preventDefault();
            setOpen(!open);
        }
    }

   return <li>
        <Link href={route(url)} className={`menu ${ route().current(url) ? 'menu--active' : '' }`} onClick={onClick}>
            <div className="menu__icon"><AppIcon name={icon}></AppIcon></div>
            <div className="menu__title">
                {title}
                {children && (
                    <div className={`menu__sub-icon ${open ? 'transform rotate-180' : ''}`}>
                        <AppIcon name="chevron-down"></AppIcon>
                    </div>
                )}
            </div>
        </Link>
        {children && (
            <ul className={open ? 'menu__sub-open' : ''}>
                {children}
            </ul>
        )}
    </li>;
}
